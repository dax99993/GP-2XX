import { EffectsChangeInfo } from "@/constants/EffectsChangeInfo";
import { BaseSysExMsg } from "@/constants/SysExMsg";
import { action, makeObservable, observable } from "mobx";
import { EffectType } from "../effect/effect";
import { GP200Model } from "../gp200";
import { MidiDevice } from "../midiDevice";
import { IActions } from "./IActions";


export class GP200Actions implements IActions{

    gp200: GP200Model;
    midi: MidiDevice;


    constructor(gp200: GP200Model, midi: MidiDevice) {
        this.midi = midi;
        this.gp200 = gp200;

        makeObservable(this, {
            gp200: observable,
            midi: observable,

            ChangePreset: action,
            NextPreset: action,
            PreviousPreset: action,

            ChangePresetChainOrder: action,

            ChangeEffectState: action,
            ChangeEffectParamValue: action,
            ChangeEffect: action,
        });
    }


    
    //  --------------------------------------------------------------------------------
    //      UTIL METHODS
    //  ---------------------------------------------------------------------------------
    byteToNibbles(n: number): number[] {
        const high_byte = (n >> 4) & 0x0f;
        const low_byte = (n) & 0x0f;

        return [high_byte, low_byte];
    }


    byteArrayToNibbleArray(bytes: number[] | Uint8Array): number[] {
        let nibbles: number[] = [];
        bytes.forEach(b => {
            nibbles.push((b >> 4) & 0x0f);
            nibbles.push((b >> 0) & 0x0f);
        })

        return nibbles; 
    }

    float32ToUint8Bytes(n : number): Uint8Array {
        // Create an ArrayBuffer with enough space for a Float32 (4 bytes)
        const buffer = new ArrayBuffer(4);
        // Create a DataView to write the Float32 value into the buffer
        const dataView = new DataView(buffer);

        // Write the Float32 value at offset 0 (little-endian by default for DataView)
        dataView.setFloat32(0, n, true); // true for little-endian

        // Create a Uint8Array from the same ArrayBuffer to access the bytes
        return new Uint8Array(buffer);
    }

    encodeParamValueFloat(n: number) {
        // Get byte representation of float32
        const uint8Array = this.float32ToUint8Bytes(n);

        // Split bytes into nibbles
        const nibbles = this.byteArrayToNibbleArray(uint8Array);

        console.log(uint8Array);
        console.log(nibbles)

        return nibbles; 
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
        const [high_byte, low_byte] = this.byteToNibbles(num);
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

    // PRESET SETTINGS ACTIONS
    //ChangePresetChainOrder(preset_num:number, fxSendPos: number, fxReturnPos: number, effectsChainOrder: number[]) {
    //ChangePresetChainOrder(fxSendPos: number, fxReturnPos: number, effectsChainOrder: number[]) {
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
        const [high_byte, low_byte] = this.byteToNibbles(preset_num);
        msg[0x15] = high_byte;
        msg[0x16] = low_byte;

        // set fx loop send pos (since value is in range 0-11) the high byte is always 0
        msg[0x19] = 0
        msg[0x1a] = fxSendPos;

        // set fx loop return pos (since value is in range 0-11) the high byte is always 0
        msg[0x1b] = 0
        msg[0x1c] = fxReturnPos;

        // set effect chain Order;
        // for(let i=0; i < chainOrder.length; i=i+1) {
        //     msg[0x1d + i] = 0;
        //     msg[0x1d+1 + i] = chainOrder[i];
        // }
        for(let p=0x1d; p <= 0x32; p=p+2) {
            msg[p] = 0;
            // maybe should round the index in chain
            msg[p+1] = effectsChainOrder[(p-0x1d)/2];
        }

        // Update model
        // This should modify a given preset not only the current, change later
        this.gp200.currentPreset.changeEffectsChainOrder(effectsChainOrder);
        // Also update FX send and return position
        //this.gp200.current_effect.

        // Send message        
        this.midi.sendMessage(msg);
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

    ChangeEffect(effectID: number[]) {
        if (this.gp200.currentEffect === undefined) { return; }

        // This is always invoked when the current effect is the one we want to change
        const pedalID = this.gp200.currentEffect.type;
        // Construct midi message
        const SysExMsg = this._contructChangeEffectMessage(pedalID, effectID);

        // CHECK WHEN TYPE IS AMP TO ALSO CHANGE THE APPROPIATE CAB
        const effectsChangeInfo = EffectsChangeInfo[EffectType[pedalID] as keyof typeof EffectsChangeInfo];
        let effectChangeInfo = effectsChangeInfo.filter(e => e.id == effectID)[0];

        // Update model
        //this.gp200.changeEffect(effectChangeInfo.name, pedalID);
        this.gp200.changeEffectByID(effectID, pedalID);

        if (effectChangeInfo.associated != undefined) { 
            const associated = effectChangeInfo.associated;
            const t: EffectType = EffectType[associated.type as keyof typeof EffectType];
            console.log(associated.name);
            //this.gp200.changeEffect(associated.name, t);
            this.gp200.changeEffectByID(associated.id, t);
        }

        // Send physical device
        this.midi.sendMessage(SysExMsg);

        if (effectChangeInfo.associated != undefined) { 
            const associated = effectChangeInfo.associated;
            const t: EffectType = EffectType[associated.type as keyof typeof EffectType];
            const SysExMsg = this._contructChangeEffectMessage(t, associated.id);
            this.midi.sendMessage(SysExMsg);
        }
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
            encodedValue = this.encodeParamValueFloat(n);
        // should i check explictly for int?
        } else {
            // round number
            encodedValue = this.encodeParamValueFloat(n);
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
        const [high_byte, low_byte] = this.byteToNibbles(num);
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

