import { ICtrlSettings } from "@/models/preset/ICtrlSettings";
import { IExpSettings } from "@/models/preset/IExpSettings";
import { IFxLoopSettings } from "@/models/preset/IFxLoopSettings";
import { IKnobSettings } from "@/models/preset/IKnobSettings";
import { IEffectInfo, IPresetInfo } from "@/models/preset/IPresetInfo";
import { DecoderUtils } from "./decodeUtils";

const PRESET_LONG_FORMAT_LENGHT = 1224;
const PRESET_SHORT_FORMAT_LENGHT = 1176;


export class PresetDecoder {
    decoder: DecoderUtils;
    constructor() {
        this.decoder = new DecoderUtils;

    }

    decodePRSTFile(buffer: Buffer): IPresetInfo {
        if (!(buffer.length == PRESET_LONG_FORMAT_LENGHT || buffer.length == PRESET_SHORT_FORMAT_LENGHT)) {
            throw new Error(`PRST files should be ${PRESET_SHORT_FORMAT_LENGHT} or ${PRESET_LONG_FORMAT_LENGHT} bytes`);
        }

        console.log("Start Decoding PRST Buffer");

        let offset = 0;
        console.log(buffer.byteOffset);
        const header = buffer.readInt32BE(offset);
        console.log("Header", header);
        if (header !== 0x54535250) {
            throw new Error("File does not have PRST header");
        }
        console.log("Correct header");
        offset += 4;

        //should contain 00 00 00 00
        offset += 4;
        //should contain 00 00 00 06
        offset += 4;
        //should contain 00 00 00 00
        offset += 4;

        const gpModel = buffer.readInt32BE(offset);
        if (gpModel !== 0x322d5047) {
            throw new Error("PRST file is not for GP-200 models");
        }
        console.log("Correct File structure for GP200");

        offset += 4;
        //should contain 00 01 01 00
        offset += 4;
        //should contain 00 00 00 00
        offset += 4;
        //should contain b8 f4 8f 02
        offset += 4;
        //should contain 28 00 00 00
        offset += 4;
        //should contain 94 04 00 00
        offset += 4;
        //should contain 4d 52 41 50 MRAP (PARAM ascii in LE)
        offset += 4;
        //should contain 94 04 00 00
        offset += 4;
        //should contain 02 00 58 00
        offset += 4;
        console.log("OFFSET after metada should be 52", offset);

        // Check end of file
        // Must be 
            // 0xc0, 0x04, 0x00, 0x00,
            // 0x00, 0x00, 0x48, 0x10


        // Actual DATA
        const presetInfo = this.decodePresetData(buffer, offset);

        return presetInfo;
    }

    decodePresetData(buffer: Buffer, offset: number): IPresetInfo {
        // function decodePresetData(buffer: Buffer) {
        console.log("Decode Preset Data", buffer.length - offset);

        //let offset = 0;

        const presetNumber = buffer.readUint8(offset);
        //console.log("Preset Number", presetNumber);
        offset += 1;

        const bpm = buffer.readInt16BE(offset);
        //console.log("Preset BPM", bpm);
        offset += 2;

        const volume = buffer.readInt16BE(offset);
        //console.log("Preset Volume", volume);
        offset += 2;

        const pan = buffer.readInt16BE(offset);
        //console.log("Preset Pan", pan);
        offset += 2;

        const category = buffer.readUInt16BE(offset);
        //console.log("Preset Category", category);
        offset += 2;

        const fxSendLevel = buffer.readUInt16BE(offset);
        //console.log("Fx Send level", fxSendLevel);
        offset += 2;

        const fxReturnLevel = buffer.readUInt16BE(offset);
        //console.log("Fx Return level", fxReturnLevel);
        offset += 2;

        const fxMode = buffer.readUInt16BE(offset);
        //console.log("Fx Mode ", fxMode);
        offset += 2;

        offset += 1; // Separation byte - 00


        // Preset name is encoded as 16 ascii characters
        const presetName: string = String.fromCharCode(...buffer.subarray(offset, offset + 16).filter(b => b != 0));
        //console.log("Preset Name", presetName);
        offset += 16;

        // Preset Author is encoded as 16 ascii characters
        const presetAuthor: string = String.fromCharCode(...buffer.subarray(offset, offset + 16).filter(b => b != 0));
        //console.log("Preset Author", presetAuthor);
        offset += 16;

        // Preset Author is encoded as 30 ascii characters ; maybe is 32 characters
        const presetNote: string = String.fromCharCode(...buffer.subarray(offset, offset + 32).filter(b => b != 0));
        //console.log("Preset Note", presetNote);
        offset += 32;

        //should contain 00 00 00 00
        offset += 4;
        //should contain 00 00 00 00
        offset += 4;
        //should can be 08 00 10 00 or some other numbers IDK what this mean
        const effectChainSequence = buffer.readUInt32BE(offset);
        if (effectChainSequence !== 0x08_00_10_00) {
            console.log("Efffect chain Bad alignment", presetNote);
        }
        offset += 4;

        // I think this byte is the preset position where it is currently stored
        const presetStoredNumber = buffer.readUint8(offset);
        //console.log("Preset Position Store Number ???", presetStoredNumber);
        offset += 1;

        offset += 1; // Separation byte - 00


        // Effect Chain
        const fxSendPosition = buffer.readUint8(offset);
        //console.log("Fx Send Position", fxSendPosition);
        offset += 1;

        const fxReturnPosition = buffer.readUint8(offset);
        //console.log("Fx Return Position", fxReturnPosition);
        offset += 1;


        const effectChainOrder = [...buffer.subarray(offset, offset + 11)];
        //console.log("Effect Chain Order", effectChainOrder);
        offset += 11;

        offset += 1; // Separation byte - 00
        console.log("Offset starting effect module information", offset);

        // EFFECT MODULE DETAILS 
        const effectsInfo: IEffectInfo[] = [];
        for (let i = 0; i < 11; i = i + 1) {
            // Each block is 72 bytes
            const effectInfo = this.decodeEffectModule(buffer, offset);
            offset += 72

            console.log(effectInfo);
            effectsInfo[i] = effectInfo;
        }

        //console.log(offset);

        // EXP Settings
        const expSettings: IExpSettings[] = [];

        // 3 types of EXP and each has 3 settings
        for (let i = 0; i < 9; i = i + 1) {
            // Each block is 16 bytes
            const expSetting = this.decodeExpSettings(buffer, offset);
            offset += 16
            // console.log(expSetting);
            expSettings[i] = expSetting;
        }

        // Knob settings
        const knobSettings: IKnobSettings[] = [];
        for (let i = 0; i < 3; i = i + 1) {
            // Each block is 8 bytes
            const knobSetting = this.decodeKnobSettings(buffer, offset);
            offset += 8
            // console.log(knobSetting);
            knobSettings[i] = knobSetting;
        }

        // CTRL settings
        const ctrlSettings: ICtrlSettings[] = [];
        if (buffer.length == PRESET_LONG_FORMAT_LENGHT) {
            for (let i = 0; i < 8; i = i + 1) {
                // Each block is 12 bytes
                const ctrlSetting = this.decodeCtrlSettings(buffer, offset);
                offset += 12
                // console.log(ctrlSetting);
                ctrlSettings[i] = ctrlSetting;
            }
        } else if (buffer.length == PRESET_SHORT_FORMAT_LENGHT) {
            for (let i = 0; i < 4; i = i + 1) {
                // Each block is 12 bytes
                const ctrlSetting = this.decodeCtrlSettings(buffer, offset);
                offset += 12
                // console.log(ctrlSetting);
                ctrlSettings[i] = ctrlSetting;
            }
            // Set other ctrl settings manually
            ctrlSettings[4] = {
                number: 4, mode: 0, pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0] 
            };
            ctrlSettings[5] = {
                number: 5, mode: 0, pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0] 
            };
            ctrlSettings[6] = {
                number: 6, mode: 0, pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0] 
            };
            ctrlSettings[7] = {
                number: 7, mode: 0, pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0] 
            };
        }

        // Create FXLoop
        const fxLoop: IFxLoopSettings = {
            sendLevel: fxSendLevel,
            returnLevel: fxReturnLevel,
            sendPosition: fxSendPosition,
            returnPosition: fxReturnPosition,
            mode: fxMode,
        }

        return {
            name: presetName,
            number: presetNumber,
            // bankCode: presetNumberToBankCode(presetNumber),

            category: category,
            author: presetAuthor,
            note: presetNote,

            volume: volume,
            pan: pan,
            bpm: bpm,

            effectsChainOrder: effectChainOrder,
            
            fxloop: fxLoop,

            knob1: knobSettings[0],
            knob2: knobSettings[1],
            knob3: knobSettings[2],

            ctrl1: ctrlSettings[0],
            ctrl2: ctrlSettings[1],
            ctrl3: ctrlSettings[2],
            ctrl4: ctrlSettings[3],

            ctrl5: ctrlSettings[4],
            ctrl6: ctrlSettings[5],
            ctrl7: ctrlSettings[6],
            ctrl8: ctrlSettings[7],

            exp1A: [expSettings[0], expSettings[1], expSettings[2]],
            exp1B: [expSettings[3], expSettings[4], expSettings[5]],
            exp2: [expSettings[6], expSettings[7], expSettings[8]],

            effects: effectsInfo,
        }
    }

    decodeEffectModule(buffer: Buffer, offset: number): IEffectInfo {
        // console.log(buffer.length);
        // This buffer should be 72 bytes
        // if (buffer.length !== 72) {
        //     throw new Error("Effect Module buffer should be 48 bytes");
        // }

        // Should be equal to 0x14_00_44_00
        const startSequence = buffer.readUInt32BE(offset);
        if (startSequence !== 0x14_00_44_00) {
            console.log("Effect Module Bad alignment")
        }
        offset += 4;

        const chainID = buffer.readUint8(offset)
        //console.log("Effect Chain ID", chainID);
        offset += 1;

        const state = buffer.readUint8(offset)
        //console.log("Effect state", state);
        offset += 1;

        // should contain 0f 00 - constant sequence
        offset += 2;


        //console.log(buffer.subarray(offset, offset+4));
        const moduleID = buffer.readUInt32LE(offset);
        console.log("Effect Module ID", moduleID);
        offset += 4;

        const params: number[] = []
        for (let i = 0; i < 15; i = i + 1) {
            const paramEncoded = [...buffer.subarray(offset, offset + 4)];
            // console.log("Encoded param", i, paramEncoded);
            const param = this.decoder.uint8BytesToFloat32(paramEncoded);
            //console.log("Effect param encoded", i, param);
            offset += 4;

            // Store in params
            params[i] = param;
        }

        //console.log(offset);

        return {
            chainID: chainID,
            ID: moduleID,
            state: state != 0, //or should it be a number?
            paramValues: params, //15 elements not all used
        }
    }

    decodeExpSettings(buffer: Buffer, offset: number): IExpSettings {

        // Should be equal to 0x0c_00_0c_00
        const startSequence = buffer.readUInt32BE(offset);
        if (startSequence !== 0x0c_00_0c_00) {
            console.log("Bad EXP alignment")
        }
        offset += 4;

        // This are combine in a single byte
        const id = (buffer.readUint8(offset) >> 4) & 0x0F;
        //console.log("Exp ID", id);

        const paramNumber = buffer.readUint8(offset) & 0x0F;
        //console.log("Exp param Number", paramNumber);

        offset += 1;

        const moduleID = buffer.readUint8(offset)
        //console.log("Exp Module ID", moduleID);
        offset += 1;

        const moduleParamID = buffer.readUint8(offset)
        //console.log("Exp Module ID", moduleParamID);
        offset += 1;

        //should contain 00
        offset += 1;

        const paramMax = this.decoder.uint8BytesToFloat32([...buffer.subarray(offset, offset + 4)]);
        offset += 4;
        const paramMin = this.decoder.uint8BytesToFloat32([...buffer.subarray(offset, offset + 4)]);


        return {
            id: id,
            paramNumber: paramNumber,
            module: moduleID,
            moduleParamID: moduleParamID,
            moduleParamNumberMin: paramMin,
            moduleParamNumberMax: paramMax,
        }
    }

    decodeKnobSettings(buffer: Buffer, offset: number): IKnobSettings {
        // Should be equal to 0x10_00_04_00
        const startSequence = buffer.readUInt32BE(offset);
        if (startSequence !== 0x10_00_04_00) {
            console.log("Bad Knob alignment")
        }
        offset += 4;

        // This are combine in a single byte
        const knobID = buffer.readUint8(offset);
        //console.log("Knob ID", knobID);
        offset += 1;

        const moduleID = buffer.readUint8(offset)
        //console.log("Knob Module ID", moduleID);
        offset += 1;

        const moduleParamID = buffer.readUint8(offset)
        //console.log("Exp Module ID", moduleParamID);
        offset += 1;

        //should contain 00
        offset += 1;

        return {
            number: knobID,
            module: moduleID,
            paramID: moduleParamID,
        }
    }

    decodeCtrlSettings(buffer: Buffer, offset: number): ICtrlSettings {
        // Should be equal to 0x0f_00_08_00
        const startSequence = buffer.readUInt32BE(offset);
        if (startSequence !== 0x0f_00_08_00) {
            console.log("Bad Ctrl alignment")
        }
        offset += 4;

        // This are combine in a single byte
        const ctrlID = buffer.readUint8(offset);
        //console.log("Ctrl ID", ctrlID);
        offset += 1;

        const ctrlMode = buffer.readUint8(offset);
        //console.log("Ctrl Mode", ctrlMode);
        offset += 1;

        //should contain 00 00
        offset += 2;

        const pedalFlags = buffer.readUint16LE(offset)
        offset += 2;

        //console.log("Pedal Flags", pedalFlags.toString(2).padStart(12, '0'));

        const pedalsAssign = []
        for (let i = 0; i < 11; i = i + 1) {
            // pedalsAssign[i] = pedalFlags & (1 << i);
            pedalsAssign[i] = (pedalFlags >> i) & 0x0001;
        }

        //console.log(pedalsAssign);

        return {
            number: ctrlID,
            mode: ctrlMode,
            pedalsAssign: pedalsAssign
        }
    }

}