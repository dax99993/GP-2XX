import { DefaultEffectsInfo } from "@/constants/DefaultEffects";
import { BaseSysExMsg } from "@/constants/SysExMsg";
import { EncoderUtils } from "@/utils/encodeUtils";
import { action, makeObservable, observable } from "mobx";
import { EffectType } from "../effect/effect";
import { GP200Model } from "../gp200";
import { MidiDevice } from "../midiDevice";
import { ExpModule } from "../preset/IExpSettings";
import { FxLoopMode } from "../preset/IFxLoopSettings";
import { KnobModule } from "../preset/IKnobSettings";
import { IActions } from "./IActions";


export class GP200MidiEncoder implements IActions{

    gp200: GP200Model;
    midi: MidiDevice;
    encoder: EncoderUtils;


    constructor(gp200: GP200Model, midi: MidiDevice) {
        this.midi = midi;
        this.gp200 = gp200;
        this.encoder = new EncoderUtils;


        makeObservable(this, {
            gp200: observable,
            midi: observable,

            ChangePreset: action,
            NextPreset: action,
            PreviousPreset: action,

            ChangePresetChainOrder: action,
            ChangePresetFxLoopPosition: action,

            ChangeEffectState: action,
            ChangeEffectParamValue: action,
            ChangeEffect: action,

            SyncingNextPreset: action,
        });

    }

    SyncingNextPreset() {
        console.log("Start syncing Preset", this.gp200.syncedPresets);
        this.AskPresetInfo(this.gp200.syncedPresets);
    }
    
    //  --------------------------------------------------------------------------------
    //      MIDI/MODEL ENCODE ACTIONS
    //  ---------------------------------------------------------------------------------

    // PRESET ACTIONS
    ChangePreset(presetNumber: number) {
        // Checks num in range [0, 255]
        const num = Math.min(Math.max(presetNumber, 0), 255);

        // Construc message
        // bytes 0x19 and 0x1a encode the preset/patch number (Hex digits)
        let msg = BaseSysExMsg.PresetAction.changePreset;
        const [high_byte, low_byte] = this.encoder.byteToNibbles(num);
        msg[0x19] = high_byte;
        msg[0x1a] = low_byte;

        // Update model
        this.gp200.changePreset(num);

        // Execute action in physical device
        this.midi.sendMessage(msg);
    }

    NextPreset() {
        if (this.gp200.currentPresetNumber === undefined) { return; }

        let num = this.gp200.currentPresetNumber + 1;
        if (num > 255) {
            num = 0;
        } else if (num < 0) {
            num = 255;
        }

        this.ChangePreset(num);
    }


    PreviousPreset() {
        if (this.gp200.currentPresetNumber === undefined) { return; }

        let num = this.gp200.currentPresetNumber - 1;
        if (num > 255) {
            num = 0;
        } else if (num < 0) {
            num = 255;
        }

        this.ChangePreset(num);
    }

    NextBank() {
        if (this.gp200.currentPresetNumber === undefined) { return; }

        let bankNum = Math.floor(this.gp200.currentPresetNumber / 4) + 1;
        if (bankNum > 63) {
            bankNum = 0
        }
        const presetNum = bankNum * 4;

        this.ChangePreset(presetNum);
    }

    PrevBank() {
        if (this.gp200.currentPresetNumber === undefined) { return; }

        let bankNum = Math.floor(this.gp200.currentPresetNumber / 4) - 1;
        if (bankNum < 0) {
            bankNum = 63
        }
        const presetNum = bankNum * 4;

        this.ChangePreset(presetNum);
    }

    SaveCurrentPreset(presetNumberToSave: number, presetName: string) {
        if (this.gp200.currentPreset === undefined) { return; }
        
        // byte 0x15 and 0x16 Preset ID to save current preset: id is split in hex digits
        // ** bytes 0x1b and 0x1c must be 0x00 and 0x02 repectively IDK what they do
        // bytes 0x1d to 0x3c Preset Name: ASCII encoded split in hex digits
        let BaseSysEx = BaseSysExMsg.PresetAction.savePreset;
        const [highByte, lowByte] = this.encoder.byteToNibbles(presetNumberToSave);
        BaseSysEx[0x15] = highByte;
        BaseSysEx[0x16] = lowByte;

        // sanity check presetName should be at most 16 ASCII characters
        // Enforce only ASCII characters
        presetName.replace(/[^\x00-\x7F]/g, "");
        const safePresetName = presetName.slice(0, 16).padEnd(16, " ");

        // Maximum of 16 characters
        const encodedName = this.encoder.encodePresetName(safePresetName);

        for(let i = 0; i < encodedName.length; i=i+1) {
            BaseSysEx[0x1d + i] = encodedName[i];
        }

        console.log(BaseSysEx);

        //Update Model
        this.gp200.savePreset(presetNumberToSave, safePresetName);


        // Send message
        this.midi.sendMessage(BaseSysEx);
    }

    // PRESET SETTINGS ACTIONS
    ChangePresetVolume(volume: number) {
        // byte 0x16 contains which parameter to change 0 -> volume; 1 -> BPM; 6 -> Pan
        // bytes 0x19 and 0x1a contain the volume and BPM value split in hex
        let BaseSysEx= BaseSysExMsg.PresetSettingsAction.changePresetVolumePanBPM;
        BaseSysEx[0x16] = 0;

        // Even if this is always positive, its encoded using twos complement  
        const encodedValue = this.encoder.encode16BitTwosComplementToNibbles(volume);
        for (let i = 0; i < encodedValue.length; i=i+1) {
            BaseSysEx[0x19 + i] = encodedValue[i];
        }

        //Update Model
        //this.gp200.currentPreset?.changeVolume(volume);

        //Send message
        this.midi.sendMessage(BaseSysEx);
    }

    ChangePresetBPM(bpm: number) {
        // byte 0x16 contains which parameter to change 0 -> volume; 1 -> BPM; 6 -> Pan
        // bytes 0x19 and 0x1a contain the volume and BPM value split in hex
        let BaseSysEx= BaseSysExMsg.PresetSettingsAction.changePresetVolumePanBPM;
        BaseSysEx[0x16] = 1;
        // Even if this is always positive, its encoded using twos complement  
        const encodedValue = this.encoder.encode16BitTwosComplementToNibbles(bpm);
        for (let i = 0; i < encodedValue.length; i=i+1) {
            BaseSysEx[0x19 + i] = encodedValue[i];
        }
        console.log("Change BPM", bpm, encodedValue);
        //Update Model
        //this.gp200.currentPreset?.changeBPM(bpm);

        //Send message
        this.midi.sendMessage(BaseSysEx);
    }

    ChangePresetPan(pan: number) {
        // byte 0x16 contains which parameter to change 0 -> volume; 1-> BPM; 6 -> Pan
        // bytes 0x19 to 0x1c contain the PAN value encoded in two's complement
        let BaseSysEx = BaseSysExMsg.PresetSettingsAction.changePresetVolumePanBPM;
        BaseSysEx[0x16] = 6;

        const encodedValue = this.encoder.encode16BitTwosComplementToNibbles(pan);
        for (let i = 0; i < encodedValue.length; i=i+1) {
            BaseSysEx[0x19 + i] = encodedValue[i];
        }

        // //Update Model
        //this.gp200.currentPreset?.changePan(pan);

        // //Send message
        this.midi.sendMessage(BaseSysEx);
    }

    ChangePresetChainOrder(effectsChainOrder: number[]) {
        if (this.gp200.currentPresetNumber === undefined) { return; }
        if (this.gp200.currentPreset === undefined) { return; }

        const preset_num = this.gp200.currentPresetNumber;
        // Keep this the same
        const fxSendPos = this.gp200.currentPreset.fxLoop.sendPosition;
        const fxReturnPos = this.gp200.currentPreset.fxLoop.returnPosition;

        // bytes 0x15 and 0x16 have the preset number
        // bytes 0x19 and 0x1a have the Fx loop send position
        // bytes 0x1b and 0x1c have the Fx loop return position
        // bytes 0x1d to 0x32 have the effect chain order
        let msg = BaseSysExMsg.PresetSettingsAction.changeChainOrder;
        // set preset number
        const [high_byte, low_byte] = this.encoder.byteToNibbles(preset_num);
        msg[0x15] = high_byte;
        msg[0x16] = low_byte;

        // set fx loop send pos (since value is in range 0-11) the high byte is always 0
        msg[0x19] = 0
        msg[0x1a] = fxSendPos;

        // set fx loop return pos (since value is in range 0-11) the high byte is always 0
        msg[0x1b] = 0
        msg[0x1c] = fxReturnPos;

        // set effect chain Order;
        for(let i=0; i < 2 * effectsChainOrder.length; i=i+2) {
            msg[0x1d + i] = 0;
            msg[0x1d + i + 1] = effectsChainOrder[i/2];
        }

        // Update model
        // This should modify a given preset not only the current, change later
        this.gp200.currentPreset.changeEffectsChainOrder(effectsChainOrder);
        // Also update FX send and return position
        //this.gp200.current_effect.

        // Send message        
        this.midi.sendMessage(msg);
    }

    // FXLOOP Settings
    ChangePresetFxLoopPosition(sendPosition: number, returnPosition: number) {
        if (this.gp200.currentPresetNumber === undefined) { return; }
        if (this.gp200.currentPreset === undefined) { return; }

        const preset_num = this.gp200.currentPresetNumber;

        // bytes 0x15 and 0x16 have the preset number
        // bytes 0x19 and 0x1a have the Fx loop send position
        // bytes 0x1b and 0x1c have the Fx loop return position
        // bytes 0x1d to 0x32 have the effect chain order
        let msg = BaseSysExMsg.PresetSettingsAction.changeChainOrder;
        // set preset number
        const [high_byte, low_byte] = this.encoder.byteToNibbles(preset_num);
        msg[0x15] = high_byte;
        msg[0x16] = low_byte;

        // set fx loop send pos (since value is in range 0-11) the high byte is always 0
        msg[0x19] = 0
        msg[0x1a] = sendPosition;

        // set fx loop return pos (since value is in range 0-11) the high byte is always 0
        msg[0x1b] = 0
        msg[0x1c] = returnPosition;

        // set effect chain Order;
        const effectsChainOrder = this.gp200.currentPreset.effectsChainOrder;
        for(let i=0; i < 2 *effectsChainOrder.length; i=i+2) {
            msg[0x1d + i] = 0;
            msg[0x1d + i + 1] = effectsChainOrder[i/2];
        }

        // Update model
        // This should modify a given preset not only the current, change later
        //this.gp200.currentPreset.changeFxLoopPosition(sendPosition, returnPosition);

        // Send message        
        this.midi.sendMessage(msg);
    }

    ChangePresetFxLoopSendLevel(sendLevel: number){
        // byte 0x16 FxLoop Parameter ID: 3 -> sendLevel; 4 -> returnLevel; 5 -> mode
        // bytes 0x19 and 0x1a Parameter Value: split in hex digits (nibbles)
        let BaseSysEx= BaseSysExMsg.PresetSettingsAction.FxLoopSettings;
        BaseSysEx[0x16] = 3;
        const [highNibble, lowNibble] = this.encoder.byteToNibbles(sendLevel);

        BaseSysEx[0x19] = highNibble;
        BaseSysEx[0x1a] = lowNibble;

        //Update Model
        //this.gp200.currentPreset?.changeFXLoopSendLevel(sendLevel);

        //Send message
        this.midi.sendMessage(BaseSysEx);
    }

    ChangePresetFxLoopReturnLevel(returnLevel: number) {
        // byte 0x16 FxLoop Parameter ID: 3 -> sendLevel; 4 -> returnLevel; 5 -> mode
        // bytes 0x19 and 0x1a Parameter Value: split in hex digits (nibbles)
        let BaseSysEx= BaseSysExMsg.PresetSettingsAction.FxLoopSettings;
        BaseSysEx[0x16] = 4;
        const [highNibble, lowNibble] = this.encoder.byteToNibbles(returnLevel);

        BaseSysEx[0x19] = highNibble;
        BaseSysEx[0x1a] = lowNibble;

        //Update Model
        //this.gp200.currentPreset?.changeFxLoopReturnLevel(returnLevel);

        //Send message
        this.midi.sendMessage(BaseSysEx);
    }

    ChangePresetFxLoopMode(mode: FxLoopMode) {
        // byte 0x16 FxLoop Parameter ID: 3 -> sendLevel; 4 -> returnLevel; 5 -> mode
        // bytes 0x19 and 0x1a Parameter Value: split in hex digits (nibbles)
        let BaseSysEx = BaseSysExMsg.PresetSettingsAction.FxLoopSettings;
        BaseSysEx[0x16] = 5;
        const [highNibble, lowNibble] = this.encoder.byteToNibbles(mode);

        BaseSysEx[0x19] = highNibble;
        BaseSysEx[0x1a] = lowNibble;

        //Update Model
        //this.gp200.currentPreset?.changeFxLoopMode(mode);

        //Send message
        this.midi.sendMessage(BaseSysEx);
    }

    // CTRL Settings
    ChangePresetCtrlSettings(ctrlID: number, pedalBinding: number[]) {
        // byte 0x16 CTRL number: number with range (0 to 7)
        // byte 0x18 CTRL mode: number with values 00 -> Yellow ; 01 -> Red
        // byte 0x1d Pedals with id 4 to 7 bind: bitflags in low nibble		     (0000 MOD;EQ;CAB;NR)
        // byte 0x1e Pedals with id 0 to 3 bind: bitflags in low nibble 		 (0000 AMP;DST;WAH;PRE)
        // byte 0x20 Pedals with id 8 to 10 bind: bitflags in low nibble 		 (0000 0;VOL;RVB;DLY)
        let BaseSysEx= BaseSysExMsg.PresetSettingsAction.CTRLSettings;
        BaseSysEx[0x16] = ctrlID;
        BaseSysEx[0x18] = 0; //force yellow for the moment

        const pedals4to7 = pedalBinding.slice(4, 8)
        .map((v, i) => v * Math.pow(2, i))
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0) & 0x0F;

        const pedals0to3 = pedalBinding.slice(0, 4)
        .map((v, i) => v * Math.pow(2, i))
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0) & 0x0F;


        const pedals8to10 = pedalBinding.slice(8, 11)
        .map((v, i) => v * Math.pow(2, i))
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0) & 0x0F;

        BaseSysEx[0x1d] = pedals4to7;
        BaseSysEx[0x1e] = pedals0to3;
        BaseSysEx[0x20] = pedals8to10;

        // //Update Model
        this.gp200.currentPreset?.changeCtrlSettings(ctrlID, pedalBinding);

        // //Send message
        this.midi.sendMessage(BaseSysEx);
    }

    // EXP Settings
    ChangePresetExpSettings(expID: number, expParamID: number, expModule: ExpModule, paramID: number, paramMin: number, paramMax: number) {
        // byte 0x15 EXP pedal to bind: values in range 0 -> 1A; 1 -> 1B; 2 -> 2
        // byte 0x16 EXP parameter number to bind: 0 -> param 1; 1 -> param 2; 2 -> param 3
        // byte 0x17 and 0x18 Module ID
        // byte 0x1a Module parameter id to bind: with values in range (0 to 14)
        // bytes 0x1d to 0x24 Parameter maximum value encoded
        // bytes 0x25 to 0x2c Parameter minimum value encoded
        let BaseSysEx = BaseSysExMsg.PresetSettingsAction.ExpSetting;
        BaseSysEx[0x15] = expID;
        BaseSysEx[0x16] = expParamID;
        const [highNibble, lowNibble] = this.encoder.byteToNibbles(expModule);
        BaseSysEx[0x17] = highNibble;
        BaseSysEx[0x18] = lowNibble;

        BaseSysEx[0x1a] = paramID;

        const encodedMin = this.encoder.encodeParamValueFloat(paramMin);
        const encodedMax = this.encoder.encodeParamValueFloat(paramMax);


        // write both params
        for(let i = 0; i < encodedMax.length; i=i+1) {
            BaseSysEx[0x1d + i] = encodedMax[i];
            BaseSysEx[0x25 + i] = encodedMin[i];
        }

        // //Update Model
        //this.gp200.currentPreset?.changeExpSettings(expID, expParamID, expModule, paramID, paramMin, paramMax);

        // //Send message
        this.midi.sendMessage(BaseSysEx);
    }

    // Knob Settings
    ChangePresetKnobSettings(knobID: number, knobModule: KnobModule, knobParameter: number = 0) {
        // byte 0x16 Knob number: Number in range (0 to 2)
        // bytes 0x17 and 0x18 Module number split in nibbles
        // byte 0x1a Parameter number: Number in range (0 to 14)
        let BaseSysEx= BaseSysExMsg.PresetSettingsAction.KnobSettings;
        BaseSysEx[0x16] = knobID;
        const [highNibble, lowNibble] = this.encoder.byteToNibbles(knobModule);
        BaseSysEx[0x17] = highNibble;
        BaseSysEx[0x18] = lowNibble;

        BaseSysEx[0x1a] = knobParameter;

        // //Update Model
        this.gp200.currentPreset?.changeKnobSettings(knobID, knobModule, knobParameter);

        // //Send message
        this.midi.sendMessage(BaseSysEx);
    }


    // EFFECT ACTIONS
    _contructChangeEffectMessage(pedalID: EffectType, effectID: number[]): number[] {
        // 38 bytes 
        // byte 0x16 is the effect ID (0-10) ; bytes 0x1d to 0x24 are the effect ID
        let baseSysEx = BaseSysExMsg.EffectActions.changeEffect;
        baseSysEx[0x16] = pedalID;

        // set the encoded values in message (8 bytes)
        for (let i = 0; i < effectID.length; i++) {
            baseSysEx[0x1d + i] = effectID[i];
        }

        return baseSysEx;
    }

    ChangeEffect(effectID: number) {
        if (this.gp200.currentEffect === undefined) { return; }

        // This is always invoked when the current effect is the one we want to change
        const pedalID = this.gp200.currentEffect.type;
        // Map int to 8 bytes hex digits little endian
        const effectIDNibbles = this.encoder.encodeEffectIDToNibbles(effectID)
        // Construct midi message
        const SysExMsg = this._contructChangeEffectMessage(pedalID, effectIDNibbles);

        // Update model
        //this.gp200.changeEffectByID(effectID, pedalID);

        // CHECK WHEN TYPE IS AMP TO ALSO CHANGE THE APPROPIATE CAB
        const defaultEffectsInfo = DefaultEffectsInfo[EffectType[pedalID] as keyof typeof DefaultEffectsInfo];
        let defaultEffectInfo = defaultEffectsInfo.filter(e => e.ID == effectID)[0];

        // When changing AMP implementations, also CAB needs to be changed
        if (defaultEffectInfo.cabCode != null) { 
            const cabCodeID = defaultEffectInfo.cabCode;
            const t: EffectType = EffectType.CAB;
            console.log("Associated cabCode", cabCodeID);
            const SysExMsg = this._contructChangeEffectMessage(t, this.encoder.encodeEffectIDToNibbles(cabCodeID));
            this.midi.sendMessage(SysExMsg);
        }

        // Send physical device
        this.midi.sendMessage(SysExMsg);
    }

    //ChangeEffectState(pedal_id: number, state: boolean) {
    ChangeEffectState(state: boolean) {
        if (this.gp200.currentPreset === undefined) { return; }
        if (this.gp200.currentEffect === undefined) { return; }

        const pedal_id = this.gp200.currentEffect.type;
        // Check pedal_id in range [0, 10]

        //byte 0x16 is the effect ID (0-10) ; byte 0x18 is the state of pedal OFF -> 0, ON -> 1
        let baseSysEx = BaseSysExMsg.EffectActions.changeState;
        baseSysEx[0x16] = pedal_id;
        baseSysEx[0x18] = state ? 1 : 0;

        // Update model
        this.gp200.currentPreset.effects[pedal_id].state = state;

        // Send to physical device
        this.midi.sendMessage(baseSysEx);
    }

    //ChangeEffectParamValue(effectChainID: number, paramId: number, paramType: string, n:number) {
    ChangeEffectParamValue(paramId: number, paramNumericType: string, n:number) {
        if (this.gp200.currentEffect === undefined) { return; }

        const effectChainID = this.gp200.currentEffect.type;

        // byte 0x16 contains the effect chain id (0 to 10)
        // byte 0x18 containes parameter id,
        // bytes 0x25 to 0x2c contains the encoded value
        let baseSysEx = BaseSysExMsg.EffectActions.changeParameterValue;
        baseSysEx[0x16] = effectChainID;
        baseSysEx[0x18] = paramId;

        let encodedValue: number[];
        if (paramNumericType == "float") {
            // round number to first decimal
            encodedValue = this.encoder.encodeParamValueFloat(n);
        // should i check explictly for int?
        } else {
            // round number
            encodedValue = this.encoder.encodeParamValueFloat(n);
        }

        // set the encoded values in message (8 bytes)
        for (let i = 0; i <= 7; i++) {
            baseSysEx[0x25 + i] = encodedValue[i];
        }

        // Update model
        this.gp200.changeParamValue(effectChainID, paramId, n);

        // Send to physical device
        this.midi.sendMessage(baseSysEx);
    }

    AskPresetInfo(presetNumber: number) {
        // Checks num in range [0, 255]
        const num = Math.min(Math.max(presetNumber, 0), 255);

        // Construct message
        // bytes 19 and 1a contain the preset Number (hex digits)
        // bytes 25 and 26 contain the preset Number (hex digits)
        // bytes 29 and 2a contain the preset Number (hex digits)
        let msg = BaseSysExMsg.askInfo.askPresetInfo;
        const [high_byte, low_byte] = this.encoder.byteToNibbles(num);
        msg[0x19] = high_byte;
        msg[0x1a] = low_byte;

        msg[0x25] = high_byte;
        msg[0x26] = low_byte;

        msg[0x29] = high_byte;
        msg[0x2a] = low_byte;

        // Execute action in physical device
        this.midi.sendMessage(msg);
    }

}

