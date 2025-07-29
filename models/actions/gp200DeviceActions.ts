import { BaseSysExMsg, GetPresetInfo, SysExGPHeader } from "@/constants/SysExMsg";
import { MIDIMessageEvent } from "@motiz88/react-native-midi";
import { makeObservable, observable } from "mobx";
import { GP200Model } from "../gp200";
import { MidiDevice } from "../midiDevice";
import { IDeviceActions } from "./IActions";

function compareArrays(a: number[] | Uint8Array, b: number[] | Uint8Array) {
    // console.log("Sizes = ", a.length, b.length);
    return a.length === b.length &&
        a.every((element, index) => element === b[index]);
}


// type midiMessage = {
//     data: number[];
//     timestamp: number;
// }



export class GP200DeviceActions implements IDeviceActions {

    gp200: GP200Model;
    midi: MidiDevice;

    //messages: midiMessage[];
    presetInfoMessages: Uint8Array[];
    message_received_counter: number;


    constructor(gp200: GP200Model, midi: MidiDevice) {
        this.midi = midi;
        this.gp200 = gp200;

        //this.messages = [];
        this.presetInfoMessages = [];
        this.message_received_counter = 0;

        // Maybe add event listener to midi device

        makeObservable(this, {
            gp200: observable,
            midi: observable,
        });
    }
    ChangePresetChainOrder(message: number[]): void {
        throw new Error("Method not implemented.");
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
            console.log(`Midievent (${this.message_received_counter}) [${event.receivedTime}] {${incomingMessage.length}}: ${messageHex}`);
            //this.message_received_counter++;
            this.decodeReceivedSysEx(event.data);
        };
        
        // add event listener to input
        //this.midi.inputPort?.addEventListener("midimessage", listener);
        this.midi.addMessageListener(listener);
    }


    // Util methods

    nibblesToByte(high_byte: number, low_byte: number): number {
        return ((high_byte & 0x0f) << 4) | (low_byte & 0x0f);
    }

    nibbleArrayToByteArray(nibbles: number[] | Uint8Array): number[] {
        let bytes: number[] = [];
        for (let i = 0; i < nibbles.length; i = i + 2) {
            const byte = ((nibbles[i] & 0x0f) << 4) | (nibbles[i + 1] & 0x0f);
            //const b = ((encoded[i] << 4) & 0xf0) | (encoded[i+1] & 0x0f);
            bytes.push(byte);
        }

        return bytes
    }

    uint8BytesToFloat32(bytes: number[]): number {
        // 'float32Bytes' should be a Uint8Array containing the 4 bytes of Float32 representation
        const float32Bytes = new Uint8Array(bytes);
        console.log("Decoded float bytes", float32Bytes);

        // 1. Create an ArrayBuffer
        const buffer = new ArrayBuffer(4);

        // 2. Create a Uint8Array view to populate the buffer
        const byteView = new Uint8Array(buffer);
        byteView.set(float32Bytes); // Copy the bytes into the buffer

        // 3. Create a DataView
        const dataView = new DataView(buffer);

        // 4. Use getFloat32() to read the number (assuming little-endian)
        return dataView.getFloat32(0, true); // 0 is the offset
    }

    decodeParamValueFloat(encoded: number[]) {
        // combine pair of encoded bytes (contains nibbles) to form a complete byte
        const bytes = this.nibbleArrayToByteArray(encoded);
        console.log("Decoding float32", encoded, bytes);
        // convert bytes to float32
        const numberValue = this.uint8BytesToFloat32(bytes)

        return numberValue;
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
       // Parse the message
       // execute corresponding action 
        if (this._isGPSysEx(message)) {
            //console.log("GP SysEx received");
            //console.log(message);
            const messageLength = message.length;
            switch (messageLength) {
                case 384: 
                    this.decodeSysEx384length(message);
                    break;
                case 146: 
                    this.decodeSysEx146length(message);
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
                    console.log("Decode", messageLength, message);
                    break;
            }
        }
    }

    decodeSysEx384length(message: Uint8Array ) {
        const presetInfoMsg1 = GetPresetInfo.message1;
        const presetInfoMsg2 = GetPresetInfo.message2;
        const presetInfoMsg3 = GetPresetInfo.message3;
        const presetInfoMsg4 = GetPresetInfo.message4;
        const presetInfoMsg5 = GetPresetInfo.message5;
        const presetInfoMsg6 = GetPresetInfo.message6;

        if ( this.isSameMessage(message, presetInfoMsg1) ) {
            console.log("Preset Info message 1 received!.");
            this.presetInfoMessages[0] = message;
        } else if ( this.isSameMessage(message, presetInfoMsg2) ) {
            console.log("Preset Info message 2 received!.");
            this.presetInfoMessages[1] = message;
        } else if ( this.isSameMessage(message, presetInfoMsg3) ) {
            console.log("Preset Info message 3 received!.");
            this.presetInfoMessages[2] = message;
        } else if ( this.isSameMessage(message, presetInfoMsg4) ) {
            console.log("Preset Info message 4 received!.");
            this.presetInfoMessages[3] = message;
        } else if ( this.isSameMessage(message, presetInfoMsg5) ) {
            console.log("Preset Info message 5 received!.");
            this.presetInfoMessages[4] = message;
        } else if ( this.isSameMessage(message, presetInfoMsg6) ) {
            console.log("Preset Info message 6 received!.");
            this.presetInfoMessages[5] = message;
        }
    }

    decodeSysEx146length(message: Uint8Array) {
        // IDK WHY is only constant up to byte 12
        const presetInfoMsg7 = GetPresetInfo.message7;

        if ( this.isSameMessage(message, presetInfoMsg7, 12)) {
            console.log("Preset Info message 7 received!.");
            this.presetInfoMessages[6] = message;
            // Extract Preset Information
            this.GetPresetInfo();
        }
    }

    decodeSysEx46length(message: Uint8Array) {
        const changeParameterValue = BaseSysExMsg.EffectActions.changeParameterValue;
        //if ( compareArrays(message.slice(0, 18+1), changeParameterValue.slice(0, 18+1))) {
        if ( this.isSameMessage(message, changeParameterValue)) {
            console.log("Change Parameter Value message received!.");
            this.ChangeEffectParamValue(message);
        }
    }

    decodeSysEx38length(message: Uint8Array) {
        const changeEffect = BaseSysExMsg.EffectActions.changeEffect;
        //if ( compareArrays(message.slice(0, 18+1), changeParameterValue.slice(0, 18+1))) {
        if ( this.isSameMessage(message, changeEffect)) {
            console.log("Change Effect message received!.");
            this.ChangeEffect(message);
        }
    }

    decodeSysEx30length(message: Uint8Array) {
        const changePresetSysEx = BaseSysExMsg.PresetAction.changePreset;
        const changeEffectState = BaseSysExMsg.EffectActions.changeState;
        // Compare to change preset message
        //if ( compareArrays(message.slice(0, 18+1), changePresetSysEx.slice(0, 18+1))) {
        if ( this.isSameMessage(message, changePresetSysEx) ) {
            console.log("Change preset message received!.");
            this.ChangePreset(message);


        } else if (this.isSameMessage(message, changeEffectState)) {
            console.log("Change Effect state message received!.");

            // decode and update model
            this.ChangeEffectState(message);
        }
    }


    // DECODE
    // PRESET ACTIONS
    ChangePreset(message: number[] | Uint8Array) {
        // bytes 0x19 and 0x1a encode the preset/patch number (Hex digits)
        let baseSysEx = message;
        const high_byte = baseSysEx[0x19] 
        const low_byte = baseSysEx[0x1a]

        const num = this.nibblesToByte(high_byte, low_byte);

        // Update model
        this.gp200.current_preset_number = num;
    }

    //PRESET SETTINGS ACTIONS

    // EFFECT ACTIONS
    ChangeEffect(message: Uint8Array) {
        // 38 bytes 
        // byte 0x16 is the effect ID (0-10) ; bytes 0x1d to 0x24 are the effect ID
        const pedalID = message[0x16];
        const effectID: number[] = Array.from(message.slice(0x1d, 0x24 + 1));
        console.log("MIDI CHANGE EFFECT ID", effectID);

        // Update model
        this.gp200.changeEffectByID(effectID, pedalID);
    }

    ChangeEffectState(message: Uint8Array) {
        //byte 0x16 is the effect ID (0-10) ; byte 0x18 is the state of pedal OFF -> 0, ON -> 1
        const pedal_id = message[0x16];
        const state = message[0x18] != 0;

        // Update model
        this.gp200.current_preset.effects[pedal_id].state = state;
    }

    ChangeEffectParamValue(message: Uint8Array) {
        // byte 0x16 contains the effect chain id (0 to 10)
        // byte 0x18 containes parameter id,
        // bytes 0x25 to 0x2c contains the encoded value
        const baseSysEx = message;
        const effectChainID = baseSysEx[0x16];
        const paramId = baseSysEx[0x18];

        // get encoded value bytes
        //const encoded = baseSysEx.slice(0x25, 0x2c + 1) as number[];
        const encoded : number[] = Array.from(baseSysEx.slice(0x25, 0x2c + 1));
        
        // Get type of encoded values
        let paramType = "";
        this.gp200.current_preset.effects[effectChainID].parameters.forEach(p => {
                if (p.id === paramId) {
                    console.log("Match Effect", effectChainID, p.name);
                    paramType = p.numeric_type[0];
                }
        });

        let decodedValue: number;
        if (paramType === "float") {
            decodedValue = this.decodeParamValueFloat(encoded);
            // round value to one decimal
            decodedValue = Math.round(decodedValue * 10) / 10;
        } else {
            decodedValue = this.decodeParamValueFloat(encoded);
            // remove decimals
            decodedValue = Math.round(decodedValue);
        }

        console.log(`Change parameter ${paramType} :`, effectChainID, paramId, decodedValue);

        // Update model
        this.gp200.changeParamValue(effectChainID, paramId, decodedValue);
    }

    // PRESET INFORMATION EXTRACTION METHODS
    uint8BytesToInt16TwosComplement(bytes: number[]): number {
        //Order is in little endian
        const lowByte = bytes[0];
        const highByte = bytes[1];

        let value = (highByte << 8) | lowByte;

        // Check if the most significant bit (sign bit) is set
        if (value & 0x8000) {
            // If it's negative, apply two's complement conversion
            value = (Math.pow(2, 16) - value) * -1;
        }
        return value;
    }

    // decodePanValue(encoded: number[]) {
    //     // combine pair of encoded bytes (contains nibbles) to form a complete byte
    //     const bytes = this.nibbleArrayToByteArray(encoded);
    //     console.log("Decoding float32", encoded, bytes);
    //     // convert bytes to float32
    //     const numberValue = this.uint8BytesToInt32(bytes)

    //     return numberValue;
    // }

    decodePanValuePresetInfo(high_nibble: number, low_nibble: number) {
        const low = this.nibblesToByte(high_nibble, low_nibble);
        const high = low <= 0x64 ? 0x00 : 0xff;

        const bytes = [low, high];
        console.log("Decoding pan value bytes", bytes);

        return this.uint8BytesToInt16TwosComplement(bytes);
    }

    decodePresetName(msg: number[]) {
        // each characters is represented in ascii, split in to nibles
        const bytes = this.nibbleArrayToByteArray(msg);
        // remove empty characters
        const filtered_bytes = bytes.filter(b => b !== 0);
        const chars = filtered_bytes.map(b => String.fromCharCode(b));

        return chars.join("");
    }
    decodeEffectInfo(msg: number[]) {
        if (msg.length != 0x90) {
            throw new Error("Effect info msg has to be 0x90 bytes");
        }

        const effectChainID = msg[0x09]
        const effectState = msg[0x0b] !== 0;
        const effectID = msg.slice(0x10, 0x17 + 1);
        let encodedParameterValues = [];
        for(let i = 0x18; i < msg.length; i=i+8) {
            encodedParameterValues.push(msg.slice(i, i+8));
        }

        console.log("Effect Chain ID", effectChainID);
        console.log("Effect ID", effectID);
        console.log("Effect State", effectState);
        console.log("Parameter encoded values\n", encodedParameterValues);

        //return [effectChainID, effectID, encodedParameterValues];
    }

    decodeExpAssignInfo(msg: number[]) {
        const expPedalID = msg[0x8];
        const expPedalParamNumber = msg[0x9];
        const expPedalModule = this.nibblesToByte(msg[0xa], msg[0xb]);
        const expPedalModuleParamID = msg[0xd];
        const maxValue = this.decodeParamValueFloat(msg.slice(0x10, 0x17 + 1));
        const minValue = this.decodeParamValueFloat(msg.slice(0x18, 0x1f + 1));

        console.log(`Exp ${expPedalID} Param ${expPedalParamNumber} Assign to\nModule ${expPedalModule} Param ${expPedalModuleParamID} range [${minValue}, ${maxValue}]`);
    }

    decodeKnobAssignInfo(msg: number[]) {
        if (msg.length != 0x10) {
            throw new Error ("Knob assign msg has to be 0x10 bytes");
        }

        const knobNumber = msg[0x9];
        const knobModule = this.nibblesToByte(msg[0xa], msg[0xb]);
        const paramID = msg[0xd];

        console.log(`Knob ${knobNumber} assign to Module ${knobModule} Param ${paramID}`);
    }

    decodeCtrlAssignInfo(msg: number[]) {
        const ctrlNumber = msg[0x9];
        const ctrlMode = msg[0xb];

        const pedals7To4 = msg[0x10];
        const pedals3To0 = msg[0x11];
        const pedals10To8 = msg[0x13];

        const pedalsBitFlags = ( (pedals10To8 << 8) | (pedals7To4 << 4) | (pedals3To0) ) & 0x07ff;

        const pedalArray = []
        for (let i = 0; i <= 10; i = i+1){
            const v = pedalsBitFlags & (1 << i) ? 1: 0;
            pedalArray.push(v);
        }

        //console.log(`CTRL ${ctrlNumber} mode ${ctrlMode} Assign to pedals ${pedalsBitFlags.toString(2).padStart(12, '0')}`);
        console.log(`CTRL ${ctrlNumber} mode ${ctrlMode} Assign to pedals ${pedalArray}`);
    }

    GetPresetInfo() {
        console.log("Processing preset info messages");
        console.log(this.presetInfoMessages);

    // ---------------------------------
    // Obtain Information from Message1 (PresetName, PresetSettings)
    // ---------------------------------
        const msg1  = this.presetInfoMessages[0];
        const msg2  = this.presetInfoMessages[1];
        const msg3  = this.presetInfoMessages[2];
        const msg4  = this.presetInfoMessages[3];
        const msg5  = this.presetInfoMessages[4];
        const msg6  = this.presetInfoMessages[5];
        const msg7  = this.presetInfoMessages[6];

        // Preset number in bytes 0x19, 0x1a (hex digits)
        const presetNumber : number = this.nibblesToByte(msg1[0x19], msg1[0x1a]);
        // Preset number in bytes 0x25, 0x26 (hex digits)

        // BPM value in bytes 0x29 and 0x2a
        const bpmValue : number = this.nibblesToByte(msg1[0x29], msg1[0x2a]);
        // Patch / Preset Volume 0x2d and 0x2e
        const presetVolume : number= this.nibblesToByte(msg1[0x2d], msg1[0x2e]);
        // Patch / Preset Pan - encoded as 16bit twos complements split in nibbles, due to range only low byte is needed in bytes 0x33 and 0x34
        const presetPan = this.decodePanValuePresetInfo(msg1[0x33], msg1[0x34]);

        // FX
        // FX send level in bytes 0x39 and 0x3a
        const fxSendLevel :number = this.nibblesToByte(msg1[0x39], msg1[0x3a]);
        // FX send level in bytes 0x3d to 0x3e
        const fxReturnLevel :number = this.nibblesToByte(msg1[0x3d], msg1[0x3e]);
        // FX mode in bytes 0x42 (0 -> parallel ; 1 -> series)
        const fxMode :number = msg1[0x42];

        // Patch Name in bytes 0x45 to 0x64 (encoded in ascii characters split in hex digits)
        const presetName = this.decodePresetName(Array.from(msg1.slice(0x45, 0x64 + 1)));
        // Patch Description maybe??? bytes 0x65 to 0xd5
        // IDK bytes 0xd4 to 0xd6
        // IDK bytes 0xd7 to 0xda
        // preset number in bytes 0xdd and 0xde

        // FX loop IN position in byte 0xe2
        const fxInPosition :number = msg1[0xe2];
        // FX loop OUT position in byte 0xe4
        const fxOutPosition :number = msg1[0xe4];
        // Effect Chain order in bytes 0xe5 to 0xfa, encoded in two bytes, only low byte has meaningful data
        const effectsChain: number[] = Array.from( msg1.slice(0xe5, 0xfa + 1).filter((_, index) => index % 2 !== 0) );

    // Obtain effects info (messages 1 to message5)

        // PRE 
        const msgPre = [...msg1.slice(0xfd, 0x17e + 1), ...msg2.slice(0x0d, 0x1a +1)];
        this.decodeEffectInfo(msgPre);

        // WAH
        const msgWah = [...msg2.slice(0x1b, 0xaa +1)];
        this.decodeEffectInfo(msgWah);

        // DST
        const msgDst = [...msg2.slice(0xab, 0x13a +1)];
        this.decodeEffectInfo(msgDst);
        
        // AMP
        const msgAmp = [...msg2.slice(0x13b, 0x17e + 1), ...msg3.slice(0x0d, 0x58 +1)];
        this.decodeEffectInfo(msgAmp);

        // NR
        const msgNr = [...msg3.slice(0x59, 0xe8 +1)];
        this.decodeEffectInfo(msgNr);

        // CAB
        const msgCab = [...msg3.slice(0xe9, 0x178 +1)];
        this.decodeEffectInfo(msgCab);

        // EQ
        const msgEq = [...msg3.slice(0x179, 0x17e + 1), ...msg4.slice(0x0d, 0x96 +1)];
        this.decodeEffectInfo(msgEq);

        // MOD
        const msgMod = [...msg4.slice(0x97, 0x126 +1)];
        this.decodeEffectInfo(msgMod);

        // DLY
        const msgDly = [...msg4.slice(0x127, 0x17e + 1), ...msg5.slice(0x0d, 0x44 +1)];
        this.decodeEffectInfo(msgDly);

        // RVB
        const msgRvb = [...msg5.slice(0x45, 0xd4 +1)];
        this.decodeEffectInfo(msgRvb);

        // VOL
        const msgVol = [...msg5.slice(0xd5, 0x164 +1)];
        this.decodeEffectInfo(msgVol);


        // LOGGING DATA
        console.log("PRESET INFO IN MESSAGE 1");
        console.log("Preset Number", presetNumber);
        console.log("BPM value",bpmValue);
        console.log("Preset Volume", presetVolume);
        console.log("Preset Pan", presetPan);

        console.log("FX send level", fxSendLevel);
        console.log("FX return level", fxReturnLevel);
        console.log("FX Mode", fxMode);

        console.log("Preset name", presetName);

        console.log("FX IN position", fxInPosition);
        console.log("FX Out position", fxOutPosition);

        console.log("Effect chain", effectsChain);


        // ---------------------------------
        // Obtain EXP assign info
        // ---------------------------------

        const msgExp1AParam1 = [...msg5.slice(0x165, 0x17e + 1), ...msg6.slice(0xd, 0x12 + 1)];
        const msgExp1AParam2 = [...msg6.slice(0x13, 0x32 + 1)];
        const msgExp1AParam3 = [...msg6.slice(0x33, 0x52 + 1)];

        const msgExp1BParam1 = [...msg6.slice(0x53, 0x72 + 1)];
        const msgExp1BParam2 = [...msg6.slice(0x73, 0x92 + 1)];
        const msgExp1BParam3 = [...msg6.slice(0x93, 0xb2 + 1)];

        const msgExp2Param1 = [...msg6.slice(0xb3, 0xd2 + 1)];
        const msgExp2Param2 = [...msg6.slice(0xd3, 0xf2 + 1)];
        const msgExp2Param3 = [...msg6.slice(0xf3, 0x112 + 1)];

        this.decodeExpAssignInfo(msgExp1AParam1);
        this.decodeExpAssignInfo(msgExp1AParam2);
        this.decodeExpAssignInfo(msgExp1AParam3);

        this.decodeExpAssignInfo(msgExp1BParam1);
        this.decodeExpAssignInfo(msgExp1BParam2);
        this.decodeExpAssignInfo(msgExp1BParam3);

        this.decodeExpAssignInfo(msgExp2Param1);
        this.decodeExpAssignInfo(msgExp2Param2);
        this.decodeExpAssignInfo(msgExp2Param3);
        //GetExpAssign()


        // ---------------------------------
        // Obtain Knob Assign Info
        // ---------------------------------
        const msgKnob1 = [...msg6.slice(0x113, 0x122 + 1)];
        const msgKnob2 = [...msg6.slice(0x123, 0x132 + 1)];
        const msgKnob3 = [...msg6.slice(0x133, 0x142 + 1)];

        this.decodeKnobAssignInfo(msgKnob1);
        this.decodeKnobAssignInfo(msgKnob2);
        this.decodeKnobAssignInfo(msgKnob3);

        // ---------------------------------
        // Obtain CTRL Assign Info
        // ---------------------------------

        const msgCtrl1 = [...msg6.slice(0x143, 0x15a + 1)];
        const msgCtrl2 = [...msg6.slice(0x15b, 0x172 + 1)];
        const msgCtrl3 = [...msg6.slice(0x173, 0x17e + 1), ...msg7.slice(0xd, 0x18 + 1)];
        const msgCtrl4 = [...msg7.slice(0x19, 0x30 + 1)];

        const msgCtrl5 = [...msg7.slice(0x31, 0x48 + 1)];
        const msgCtrl6 = [...msg7.slice(0x49, 0x60 + 1)];
        const msgCtrl7 = [...msg7.slice(0x61, 0x78 + 1)];
        const msgCtrl8 = [...msg7.slice(0x79, 0x90 + 1)];

        this.decodeCtrlAssignInfo(msgCtrl1);
        this.decodeCtrlAssignInfo(msgCtrl2);
        this.decodeCtrlAssignInfo(msgCtrl3);
        this.decodeCtrlAssignInfo(msgCtrl4);
        this.decodeCtrlAssignInfo(msgCtrl5);
        this.decodeCtrlAssignInfo(msgCtrl6);
        this.decodeCtrlAssignInfo(msgCtrl7);
        this.decodeCtrlAssignInfo(msgCtrl8);


        // Reset meessage accumulator
        this.presetInfoMessages = [];
    }

}

