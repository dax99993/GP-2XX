import { BaseSysExMsg, PresetFromMemorySysEx, SysExGPHeader } from "@/constants/SysExMsg";
import { DecoderUtils } from "@/utils/decodeUtils";
// import { MIDIMessageEvent } from "@motiz88/react-native-midi";
import { action, makeObservable, observable } from "mobx";
import { MIDIMessageEvent } from "react-native-midi";
import { EffectType } from "../effect/effect";
import { GP200Model } from "../gp200";
import { MidiDevice } from "../midiDevice";
import { ExpModule } from "../preset/IExpSettings";
import { IPresetInfo } from "../preset/IPresetInfo";
import { IDeviceActions } from "./IActions";

import { PresetImporter } from "@/utils/presetImporter";
import { Buffer } from "buffer";

function compareArrays(a: number[] | Uint8Array, b: number[] | Uint8Array) {
    // console.log("Sizes = ", a.length, b.length);
    return a.length === b.length &&
        a.every((element, index) => element === b[index]);
}


export class GP200MidiDecoder implements IDeviceActions {

    gp200: GP200Model;
    midi: MidiDevice;
    decoder: DecoderUtils;
    presetImporter: PresetImporter;

    //messages: midiMessage[];
    presetInfoMessages: Uint8Array[];
    message_received_counter: number;


    constructor(gp200: GP200Model, midi: MidiDevice) {
        this.midi = midi;
        this.gp200 = gp200;
        this.decoder = new DecoderUtils();
        this.presetImporter = new PresetImporter;

        //this.messages = [];
        this.presetInfoMessages = [];
        this.message_received_counter = 0;


        makeObservable(this, {
            gp200: observable,
            midi: observable,

            SyncPresetInfo: action,
        });
    }

    get isJR() {
        return this.gp200.isJR;
    }

    // DECODE - ACTIONS


    SyncPresetInfo() {
        // Extract Preset Information
        const presetInfo = this.GetPresetInfo();
        console.log(`PRESET NUMBER (${presetInfo.number})`);

        // Check if syncing stored presets or syncing current preset
        if (this.gp200.syncingStoredPresets) {
            // Update model
            this.gp200.addPreset(presetInfo);

            // Notify synced stored preset
            this.gp200.StoredPresetSynced();
        } else if (this.gp200.syncingCurrentPreset) {
            // Update model
            this.gp200.addCurrentPreset(presetInfo);

            // Notify synced current preset
            this.gp200.CurrentPresetSynced();
        }
    }


    // PRESET ACTIONS
    ChangePreset(message: number[] | Uint8Array) {

        // bytes 0x19 and 0x1a encode the preset/patch number (Hex digits)
        let baseSysEx = message;
        const high_byte = baseSysEx[0x19] 
        const low_byte = baseSysEx[0x1a]

        const num = this.decoder.nibblesToByte(high_byte, low_byte);

        // Update model
        this.gp200.changePreset(num);
    }

    ChangePresetChainOrder(message: Uint8Array): void {
        if (this.gp200.currentPreset === undefined) { return; }
        // bytes 0x15 and 0x16 have the preset number
        // bytes 0x19 and 0x1a have the Fx loop send position
        // bytes 0x1b and 0x1c have the Fx loop return position
        // bytes 0x1d to 0x32 have the effect chain order
        // set preset number
        const presetNumber = this.decoder.nibblesToByte(message[0x15], message[0x16]);

        // set fx loop send pos (since value is in range 0-11) the high byte is always 0
        const sendPosition = message[0x1a];
        // set fx loop return pos (since value is in range 0-11) the high byte is always 0
        const returnPosition = message[0x1c];

        // set effect chain Order;
        let effectsChainOrder = []
        for (let i = 0x1d; i < 0x32; i=i+2){
           effectsChainOrder.push(message[i+1]); 
        }
        //console.log(effectsChainOrder.length, effectsChainOrder);

        // Update model
        // This should modify a given preset not only the current, change later
        // Actually should update preset
        if (presetNumber === this.gp200.currentPresetNumber) {
            this.gp200.changePresetChainOrder(effectsChainOrder);
            this.gp200.changePresetFxLoopPosition(sendPosition, returnPosition);
        }
        //this.gp200.presets[presetNumber].changeEffectsChainOrder(effectsChainOrder)
        //this.gp200.presets[presetNumber].changeFxLoopPosition(sendPosition, returnPosition);
    }

    saveCurrentPreset(message: Uint8Array): void {
        if (this.gp200.currentPreset === undefined) { return; }
        
        // byte 0x15 and 0x16 Preset ID to save current preset: id is split in hex digits
        // ** bytes 0x19 and 0x1c changing constantly IDK what they do maybe some timestamp
        // bytes 0x1d to 0x3c Preset Name: ASCII encoded split in hex digits
        const highByte = message[0x15];
        const lowByte = message[0x16];
        const presetNumberToSave = this.decoder.nibblesToByte(highByte, lowByte)

        const encodedName = [...message.slice(0x1d, 0x3c + 1)];
        let presetName = this.decoder.decodePresetName(encodedName);
        // Sanity check presetName should be at most 16 ASCII characters
        // Remove NON printable ASCII characters
        presetName = presetName.replace(/[^\x20-\x7E]/g, "");
        // trim white spaces at the end
        presetName = presetName.trimEnd();

        console.log(presetNumberToSave, presetName);

        //Update Model
        this.gp200.saveCurrentPreset(presetNumberToSave, presetName);
    }

    //PRESET SETTINGS ACTIONS
    ChangePresetVolumePanBPMFxLoopSettings(message: Uint8Array) {
        // byte 0x16 contains which parameter to change 0 -> volume; 1->BPM; 6 -> Pan
        // bytes 0x19 and 0x1a contain the volume and BPM value split in hex
        // bytes 0x19 to 0x1c contain the PAN value encoded in two's complement
        const param = message[0x16];

        switch (param) {
            case 0:
                const volume = this.decoder.nibblesTo16BitTwosComplement([...message.slice(0x19, 0x1c + 1)]);
                // //Update Model
                this.gp200.currentPreset?.changeVolume(volume);
                break
            case 1:
                const bpm = this.decoder.nibblesTo16BitTwosComplement([...message.slice(0x19, 0x1c + 1)]);
                // //Update Model
                this.gp200.currentPreset?.changeBPM(bpm);
                break
            case 3:
                const sendLevel = this.decoder.nibblesToByte(message[0x19], message[0x1a]);
                // //Update Model
                this.gp200.currentPreset?.changeFXLoopSendLevel(sendLevel);
                break;
            case 4:
                const returnLevel = this.decoder.nibblesToByte(message[0x19], message[0x1a]);
                // //Update Model
                this.gp200.currentPreset?.changeFxLoopReturnLevel(returnLevel);
                break
            case 5:
                const mode = this.decoder.nibblesToByte(message[0x19], message[0x1a]);
                // //Update Model
                this.gp200.currentPreset?.changeFxLoopMode(mode);
                break;
            case 6:
                const pan = this.decoder.nibblesTo16BitTwosComplement([...message.slice(0x19, 0x1c + 1)]);
                // //Update Model
                this.gp200.currentPreset?.changePan(pan);
                break;
            default:
                break;
        }
    }

    // FX Loop
    ChangePresetExpSettings(message: Uint8Array) {
        if (this.gp200.currentPreset == undefined) return;
        // byte 0x15 EXP pedal to bind: values in range 0 -> 1A; 1 -> 1B; 2 -> 2
        // byte 0x16 EXP parameter number to bind: 0 -> param 1; 1 -> param 2; 2 -> param 3
        // byte 0x17 and 0x18 Module ID
        // byte 0x1a Module parameter id to bind: with values in range (0 to 14)
        // bytes 0x1d to 0x24 Parameter maximum value encoded
        // bytes 0x25 to 0x2c Parameter minimum value encoded
        const expID = message[0x15];
        const expParamID = message[0x16];
        const expModule = this.decoder.nibblesToByte(message[0x17], message[0x18]) as ExpModule;
        const moduleParamID = message[0x1a];
        
        const paramMaxEncoded = [...message.slice(0x1d, 0x24 + 1)];
        const paramMinEncoded = [...message.slice(0x25, 0x2c + 1)];

        // Get parameter type for correct decoding format
        const isParamDecimal = expModule == ExpModule.MOD || expModule == ExpModule.DLY;
        const paramMax = this.decoder.decodeParamValue(paramMaxEncoded, isParamDecimal);
        const paramMin = this.decoder.decodeParamValue(paramMinEncoded, isParamDecimal);

        // //Update Model
        this.gp200.currentPreset.changeExpSettings(expID, expParamID, expModule, moduleParamID, paramMin, paramMax);
    }


    // Knob
    ChangePresetKnobSettings(message: Uint8Array) {
        // byte 0x16 Knob number: Number in range (0 to 2)
        // bytes 0x17 and 0x18 Module number split in nibbles
        // byte 0x1a Parameter number: Number in range (0 to 14)
        const knobID = message[0x16];
        const knobModule = this.decoder.nibblesToByte(message[0x17], message[0x18]);
        const knobParameter = message[0x1a];

        // //Update Model
        this.gp200.currentPreset?.changeKnobSettings(knobID, knobModule, knobParameter);
    }

    // CTRL
    ChangePresetCtrlSettings(message: Uint8Array) {
        // byte 0x16 CTRL number: number with range (0 to 7)
        // byte 0x18 CTRL mode: number with values 00 -> Yellow ; 01 -> Red
        // byte 0x1d Pedals with id 4 to 7 bind: bitflags in low nibble		     (0000 MOD;EQ;CAB;NR)
        // byte 0x1e Pedals with id 0 to 3 bind: bitflags in low nibble 		 (0000 AMP;DST;WAH;PRE)
        // byte 0x20 Pedals with id 8 to 10 bind: bitflags in low nibble 		 (0000 0;VOL;RVB;DLY)
        const ctrlID = message[0x16];
        const ctrlMode = message[0x18];

        // Get all pedal binding in a single integer
        const pedals4to7 = message[0x1d] & 0x0F;
        const pedals0to3 = message[0x1e] & 0x0F;
        const pedals8to10 = message[0x20] & 0x0F;

        const pedals = (pedals8to10 << 8) | (pedals4to7) << 4 | pedals0to3;

        let pedalBinding = [];
        for(let i = 0; i < 12; i=i+1) {
            pedalBinding[i] = (pedals & (1<<i)) != 0 ? 1 : 0;
        }

        // //Update Model
        this.gp200.currentPreset?.changeCtrlSettings(ctrlID, pedalBinding);

    }

    // EFFECT ACTIONS
    ChangeEffect(message: Uint8Array) {
        // 38 bytes 
        // byte 0x16 is the effect ID (0-10) ; bytes 0x1d to 0x24 are the effect ID
        const pedalID = message[0x16];
        const effectIDNibbles: number[] = Array.from(message.slice(0x1d, 0x24 + 1));
        console.log("MIDI CHANGE EFFECT ID", effectIDNibbles);

        const effectID = this.decoder.decodeEffectIDNibbles(effectIDNibbles)
        // Update model
        this.gp200.changeEffectByID(effectID, pedalID);
    }

    ChangeEffectState(message: Uint8Array) {
        //byte 0x16 is the effect ID (0-10) ; byte 0x18 is the state of pedal OFF -> 0, ON -> 1
        const pedal_id = message[0x16];
        const state = message[0x18] != 0;

        // Update model
        if (this.gp200.currentPreset) {
            //this.gp200.currentPreset.effects[pedal_id].state = state;
            this.gp200.currentPreset.effects[pedal_id].changeState(state);
        }
    }

    ChangeEffectParamValue(message: Uint8Array) {
        if (!this.gp200.currentPreset) {return;}

        // byte 0x16 contains the effect chain id (0 to 10)
        // byte 0x18 containes parameter id,
        // bytes 0x25 to 0x2c contains the encoded value
        const effectChainID = message[0x16] as EffectType;
        const paramId = message[0x18];

        // get encoded value bytes
        const encoded : number[] = Array.from(message.slice(0x25, 0x2c + 1));
        
        // Get type of encoded values
        const isParamDecimal = effectChainID === EffectType.MOD || effectChainID == EffectType.DLY;

        const decodedValue = this.decoder.decodeParamValue(encoded, isParamDecimal);

        //console.log(`Change parameter ${paramType} :`, effectChainID, paramId, decodedValue);

        // Update model
        this.gp200.changeParamValue(effectChainID, paramId, decodedValue);
    }


    GetPresetInfo(): IPresetInfo {

        const msg1  = this.presetInfoMessages[0];
        const msg2  = this.presetInfoMessages[1];
        const msg3  = this.presetInfoMessages[2];
        const msg4  = this.presetInfoMessages[3];
        const msg5  = this.presetInfoMessages[4];
        const msg6  = this.presetInfoMessages[5];
        const msg7  = this.presetInfoMessages[6];

        // Combine message to form all the preset data
        const presetDataNibbles = [
            ...msg1.slice(0x25, msg1.length - 1),
            ...msg2.slice(0x0d, msg2.length - 1),
            ...msg3.slice(0x0d, msg3.length - 1),
            ...msg4.slice(0x0d, msg4.length - 1),
            ...msg5.slice(0x0d, msg5.length - 1),
            ...msg6.slice(0x0d, msg6.length - 1),
            ...msg7.slice(0x0d, msg7.length - 1),
        ]

        console.log("----------------------------------------------------------------------------\n\n");
        //console.log("Preset Nibbles", presetDataNibbles.length, presetDataNibbles);
        const presetData = this.decoder.nibbleArrayToByteArray(presetDataNibbles);
        // This should have 1164 length as it does not contain the last 8 bytes as the .prst file does IDK why.
        console.log("Preset DATA", presetData.length, presetData);
        console.log("----------------------------------------------------------------------------\n\n");

        // Reset meessage accumulator
        this.presetInfoMessages = [];

        // decode preset data 
        // Is it always the long format for all models?
        return this.presetImporter.decoder.decodePresetData(Buffer.from(presetData), 0, false);
    }


    // Setup MIDI listener
    sendSysEx(message: Uint8Array | number[]) {
        this.midi.outputPort?.send(message);
    }

    setupReceivedSysEx() {
        // Create event listener
        const listener = (event: MIDIMessageEvent) => {
            // const incomingMessage = {
            //     dataHex: [...event.data],
            //     origin: this.inputPort.name,
            // };

            const incomingMessage = [...event.data];
            const messageHex = incomingMessage.map((b) => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
            console.log(`MidiEvent (${this.message_received_counter}) [${event.receivedTime}] {${incomingMessage.length}}: ${messageHex}`);
            //this.message_received_counter++;
            this.decodeReceivedSysEx(event.data);
        };
        
        // add event listener to input
        this.midi.addMIDIMessageListener(listener);
    }


    // MIDI utils
    _isSysEx(message: number[] | Uint8Array) {
       return message[0] == 0xf0 && message[message.length - 1] == 0xf7;
    }

    _isGPSysEx(message: Uint8Array) {
        return this._isSysEx(message) &&
        compareArrays(message.slice(1, SysExGPHeader.length + 1), SysExGPHeader);
    }

    compareMessage(receivedMessage: number[] | Uint8Array, sysExMessage: number[] | Uint8Array, offset: number, length: number): boolean {
        const a = receivedMessage.slice(offset, length + 1);
        const b = sysExMessage.slice(offset, length + 1);
        return compareArrays(a, b)
    }

    isSameMessage(receivedMessage: number[] | Uint8Array, sysExMessage: number[] | Uint8Array, upto: number = 18): boolean {
        // so far all board received messages are descernible base on the first 19 bytes
        return this.compareMessage(receivedMessage, sysExMessage, 0, upto);
    }


    // MIDI DECODE METHODS
    decodeReceivedSysEx(message: Uint8Array) {
       // Parse the message and execute corresponding action 
        if (this._isGPSysEx(message)) {
            const messageLength = message.length;
            switch (messageLength) {
                case 384: 
                    this.decodeSysEx384length(message);
                    break;
                case 146: 
                    this.decodeSysEx146length(message);
                    break;
                case 62:
                    this.decodeSysEx62length(message);
                    break;
                case 54:
                    this.decodeSysEx54length(message);
                    break;
                case 46: 
                    this.decodeSysEx46length(message);
                    break;
                case 38:
                    this.decodeSysEx38length(message);
                    break;
                case 30:
                    this.decodeSysEx30length(message);
                    break;
                default:
                    console.log(`DECODE (${messageLength}):\t${message}`);
                    break;
            }
        }
    }

    // Only used to sync presets
    decodeSysEx384length(message: Uint8Array ) {
        const presetInfoMsg1 = PresetFromMemorySysEx.message1;
        const presetInfoMsg2 = PresetFromMemorySysEx.message2;
        const presetInfoMsg3 = PresetFromMemorySysEx.message3;
        const presetInfoMsg4 = PresetFromMemorySysEx.message4;
        const presetInfoMsg5 = PresetFromMemorySysEx.message5;
        const presetInfoMsg6 = PresetFromMemorySysEx.message6;

        if ( this.isSameMessage(message, presetInfoMsg1, 12) ) {
            // Set syncing flag
            this.gp200.syncing = true;

            if (this.presetInfoMessages.length > 1) {return}

            this.presetInfoMessages[0] = message;
            console.log("Preset Info message 1 received!.");
        } else if ( this.isSameMessage(message, presetInfoMsg2, 12) ) {

            if (this.presetInfoMessages.length > 2) {return}
            this.presetInfoMessages[1] = message;
            console.log("Preset Info message 2 received!.");
        } else if ( this.isSameMessage(message, presetInfoMsg3, 12) ) {
            if (this.presetInfoMessages.length > 3) {return}

            console.log("Preset Info message 3 received!.");
            this.presetInfoMessages[2] = message;
        } else if ( this.isSameMessage(message, presetInfoMsg4, 12) ) {
            if (this.presetInfoMessages.length > 4) {return}

            this.presetInfoMessages[3] = message;
            console.log("Preset Info message 4 received!.");
        } else if ( this.isSameMessage(message, presetInfoMsg5, 12) ) {
            if (this.presetInfoMessages.length > 5) {return}

            console.log("Preset Info message 5 received!.");
            this.presetInfoMessages[4] = message;
        } else if ( this.isSameMessage(message, presetInfoMsg6, 12) ) {
            if (this.presetInfoMessages.length > 6) {return}
            
            console.log("Preset Info message 6 received!.");
            this.presetInfoMessages[5] = message;
        }
    }

    // Only used to sync presets in gp200 and gp200 lt (last 4 switches)
    decodeSysEx146length(message: Uint8Array) {
        // IDK WHY is only constant up to byte 12
        const presetInfoMsg7 = PresetFromMemorySysEx.message7;

        if ( this.isSameMessage(message, presetInfoMsg7, 12)) {
            if (this.presetInfoMessages.length > 7) {return}

            this.presetInfoMessages[6] = message;
            console.log("Preset Info message 7 received!.");
            this.SyncPresetInfo();
        }
    }

    decodeSysEx62length(message: Uint8Array) {
        const saveCurrentPreset = BaseSysExMsg.PresetAction.saveCurrentPreset;

        if ( this.isSameMessage(message, saveCurrentPreset)) {
            console.log("Save Current Preset message received!.");
            this.saveCurrentPreset(message);
        }
    }

    decodeSysEx54length(message: Uint8Array) {
        const changeChainOrder = BaseSysExMsg.PresetSettingsAction.changeChainOrder;

        if ( this.isSameMessage(message, changeChainOrder)) {
            console.log("Change Chain Order message received!.");
            this.ChangePresetChainOrder(message);
        }
    }

    decodeSysEx46length(message: Uint8Array) {
        const changeParameterValue = BaseSysExMsg.EffectActions.changeParameterValue;
        const changePresetExpSettings = BaseSysExMsg.PresetSettingsAction.ExpSetting;

        if ( this.isSameMessage(message, changeParameterValue)) {
            console.log("Change Parameter Value message received!.");
            this.ChangeEffectParamValue(message);
        } else if (this.isSameMessage(message, changePresetExpSettings)) {
            console.log("Change Preset Exp Settings message received!.");
            // decode and update model
            this.ChangePresetExpSettings(message);
        }
    }

    decodeSysEx38length(message: Uint8Array) {
        const changeEffect = BaseSysExMsg.EffectActions.changeEffect;
        const changePresetCtrlSettings = BaseSysExMsg.PresetSettingsAction.CTRLSettings;
        
        if ( this.isSameMessage(message, changeEffect)) {
            console.log("Change Effect message received!.");
            this.ChangeEffect(message);
        } else if (this.isSameMessage(message, changePresetCtrlSettings)) {
            console.log("Change Preset Ctrl Settings message received!.");
            // decode and update model
            this.ChangePresetCtrlSettings(message);
        }
    }

    decodeSysEx30length(message: Uint8Array) {
        const changePresetSysEx = BaseSysExMsg.PresetAction.changePreset;
        const changeEffectState = BaseSysExMsg.EffectActions.changeState;
        const changePresetKnobSettings = BaseSysExMsg.PresetSettingsAction.KnobSettings;
        // this message is the same as changeFxLoopSettings so only declare it here and decode both
        const changePresetVolumePanBPM = BaseSysExMsg.PresetSettingsAction.changePresetVolumePanBPM;

        // Compare to change preset message
        if ( this.isSameMessage(message, changePresetSysEx) ) {
            console.log("Change preset message received!.");
            this.ChangePreset(message);

        } else if (this.isSameMessage(message, changeEffectState)) {
            console.log("Change Effect state message received!.");
            // decode and update model
            this.ChangeEffectState(message);
        } else if (this.isSameMessage(message, changePresetVolumePanBPM)) {
            console.log("Change Preset Vol BPM PAN or FXLoop Settings message received!.");
            // decode and update model
            this.ChangePresetVolumePanBPMFxLoopSettings(message);
        } else if (this.isSameMessage(message, changePresetKnobSettings)) {
            console.log("Change Preset Knpb Settings message received!.");
            // decode and update model
            this.ChangePresetKnobSettings(message);
        }
    }

}

