
import { ICtrlSettings } from '@/models/preset/ICtrlSettings';
import { IExpSettings } from '@/models/preset/IExpSettings';
import { IKnobSettings } from '@/models/preset/IKnobSettings';
import { IEffectInfo, IPresetInfo } from '@/models/preset/IPresetInfo';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { Buffer } from "buffer";
import { EncoderUtils } from './encodeUtils';


export class PresetExporter{
    binaryFiles: Buffer[];
    presets: IPresetInfo[];

    encoder: EncoderUtils;

    constructor() {
        this.binaryFiles = [];
        this.presets = [];

        this.encoder = new EncoderUtils();
    }

    async SaveFiles(presetsInfo: IPresetInfo[]): Promise<Boolean> {
        // Reset storage
        this.binaryFiles = [];

        if (await Sharing.isAvailableAsync()) {
            presetsInfo.forEach(async (presetInfo: IPresetInfo) => {
                // For each file share
                const encodedBuffer = this.encodePreset();
                // Get URI from cacheDirectory
                const filename = FileSystem.cacheDirectory + presetInfo.bankCode + ' ' + presetInfo.name + '.prst';
                try {
                    const file = new FileSystem.File
                    console.log('File created successfully at:', filename);
                }
                const uri = "";
                await Sharing.shareAsync(uri, { mimeType: "application/octet-stream" });
            })
        } else {
            return false;
        }

        return true;
    }

    encodePreset(): Buffer[] {
        // Reset storage
        this.presets = [];

        this.binaryFiles.forEach(buffer => {
            const presetInfo = this.encodePRSTBinaryFile();
            this.presets.push(presetInfo);
        });

        return this.presets;
    }

    encodePRSTBinaryFile(presetInfo: IPresetInfo): Buffer {
        console.log("Start Encoding");
        let offset = 0;
        const buffer = Buffer.alloc(1172);
        console.log("Buffer byte offset:", buffer.byteOffset);

        // WRITE METADATA
        // header is TSRP
        const header = 0x54_53_52_50 
        offset += buffer.writeUInt32BE(header, offset);
        //should contain 00 00 00 00
        offset += buffer.writeUInt32BE(0, offset);
        //should contain 00 00 00 06
        offset += buffer.writeUInt32BE(6, offset);
        //should contain 00 00 00 00
        offset += buffer.writeUInt32BE(0, offset);
        // 2-PG
        const gpModel = 0x32_2d_50_47
        offset += buffer.writeUInt32BE(gpModel, offset);
        //should contain 00 01 01 00
        offset += buffer.writeUInt32BE(0x00_01_01_00, offset);
        //can contain 00 00 00 00 (IDK what these bytes mean)
        offset += buffer.writeUInt32BE(0, offset);
        //can contain b8 f4 8f 02 (IDK what these bytes mean but are not constant)
        offset += buffer.writeUInt32BE(0xb8_f4_8f_02, offset);
        //should contain 28 00 00 00
        offset += buffer.writeUInt32BE(0x28_00_00_00, offset);
        //should contain 94 04 00 00
        offset += buffer.writeUInt32BE(0x94_04_00_00, offset);
        //should contain 4d 52 41 50 MRAP (PARAM ascii in LE)
        offset += buffer.writeUInt32BE(0x4d_52_41_50, offset);
        //should contain 94 04 00 00
        offset += buffer.writeUInt32BE(0x94_04_00_00, offset);
        //should contain 02 00 58 00
        offset += buffer.writeUInt32BE(0x28_00_00_00, offset);
        console.log("Offset after meta data:", offset);

        // WRITE ACTUAL DATA
        const end_offset = this.encodePresetData(buffer, offset, presetInfo);
        console.log("Result offset should be 1772", end_offset);
        
        return buffer;
    }

    encodePresetData(buffer: Buffer, offset: number, presetInfo: IPresetInfo): number{
        // function decodePresetData(buffer: Buffer) {
        console.log("Encode Preset Data", offset);

        // preset number
        offset += buffer.writeUint8(presetInfo.number, offset);

        // Preset bpm, volume and pan
        offset += buffer.writeInt16BE(presetInfo.bpm, offset);

        offset += buffer.writeInt16BE(presetInfo.volume, offset);

        offset += buffer.writeInt16BE(presetInfo.pan, offset);

        // Preset category
        // offset = buffer.writeUInt16BE(presetInfo.category, offset);
        offset = buffer.writeUInt16BE(0, offset);

        // FX send level, return level, mode
        offset += buffer.writeUInt16BE(presetInfo.fxloop.sendLevel, offset);

        offset += buffer.writeUInt16BE(presetInfo.fxloop.returnLevel, offset);

        offset += buffer.writeUInt16BE(presetInfo.fxloop.mode, offset);

        // Separation byte - 00
        offset += buffer.writeUInt8(0, offset);

        // Preset name is encoded as 16 ascii characters
        // const presetName: string = String.fromCharCode(...buffer.subarray(offset, offset + 16));
        const presetName: string = presetInfo.name.padEnd(16, '\0');
        for (let i=0; i<presetName.length; i=i+1) {
            offset += buffer.writeUInt8(presetName.charCodeAt(i), offset);
        }

        // Preset Author is encoded as 16 ascii characters
        // const presetAuthor: string = String.fromCharCode(...buffer.subarray(offset, offset + 16));
        const presetAuthor: string = presetInfo.author.padEnd(16, '\0');
        for (let i=0; i < presetAuthor.length; i=i+1) {
            offset += buffer.writeUInt8(presetAuthor.charCodeAt(i), offset);
        }

        // Preset Author is encoded as 30 ascii characters ; maybe is 32 characters
        // const presetNote: string = String.fromCharCode(...buffer.subarray(offset, offset + 30));
        const presetNote: string = presetInfo.note.padEnd(32, '\0');
        for (let i=0; i < presetAuthor.length; i=i+1) {
            offset += buffer.writeUInt8(presetNote.charCodeAt(i), offset);
        }

        //should contain 00 00 00 00
        offset += buffer.writeUInt32BE(0, offset);
        //should contain 00 00 00 00
        offset += buffer.writeUInt32BE(0, offset);
        //should can be 08 00 10 00 or some other numbers IDK what this mean
        offset += buffer.writeUInt32BE(0x08_00_10_00, offset);

        // I think this byte is the preset position where it is currently stored
        offset += buffer.writeUInt16BE(presetInfo.number, offset);

        // Separation byte - 00
        offset += buffer.writeUInt8(0, offset);


        // FX send and return position
        offset += buffer.writeUInt8(presetInfo.fxloop.sendPosition, offset);
        offset += buffer.writeUInt8(presetInfo.fxloop.sendPosition, offset);

        // Effect Chain
        presetInfo.effectsChainOrder.filter(n => n >=0 ).forEach(ID => {
            offset += buffer.writeUInt8(ID, offset);
        })

        // Separation byte - 00
        offset += buffer.writeUInt8(0, offset);

        console.log("Offset starting effect module information", offset);


        // EFFECT MODULE DETAILS 
        for (let i = 0; i < 11; i = i + 1) {
            // Each block is 72 bytes
            offset += this.encodeEffectModule(buffer, offset, presetInfo.effects[i]);
        }

        //console.log(offset);

        // EXP Settings

        // 3 types of EXP and each has 3 settings
        for (let i = 0; i < 3; i = i + 1) {
            // Each block is 16 bytes
            offset += this.encodeExpSettings(buffer, offset, presetInfo.exp1A[i]);
        }
        for (let i = 0; i < 3; i = i + 1) {
            // Each block is 16 bytes
            offset += this.encodeExpSettings(buffer, offset, presetInfo.exp1B[i]);
        }
        for (let i = 0; i < 3; i = i + 1) {
            // Each block is 16 bytes
            offset += this.encodeExpSettings(buffer, offset, presetInfo.exp2[i]);
        }


        // Knob settings
        // Each block is 8 bytes
        offset += this.encodeKnobSettings(buffer, offset, presetInfo.knob1);
        offset += this.encodeKnobSettings(buffer, offset, presetInfo.knob2);
        offset += this.encodeKnobSettings(buffer, offset, presetInfo.knob3);


        // CTRL settings
        // Each block is 12 bytes
        offset += this.encodeCtrlSettings(buffer, offset, presetInfo.ctrl1);
        offset += this.encodeCtrlSettings(buffer, offset, presetInfo.ctrl2);
        offset += this.encodeCtrlSettings(buffer, offset, presetInfo.ctrl3);
        offset += this.encodeCtrlSettings(buffer, offset, presetInfo.ctrl4);

        offset += this.encodeCtrlSettings(buffer, offset, presetInfo.ctrl5);
        offset += this.encodeCtrlSettings(buffer, offset, presetInfo.ctrl6);
        offset += this.encodeCtrlSettings(buffer, offset, presetInfo.ctrl7);
        offset += this.encodeCtrlSettings(buffer, offset, presetInfo.ctrl8);

        // END BYTES
        
        offset += buffer.writeUInt32BE(0xc0_04_00_00, offset);
        offset += buffer.writeUInt32BE(0x00_00_48_10, offset);

        return offset;
    }

    encodeEffectModule(buffer: Buffer, offset: number, effectInfo: IEffectInfo): number {
        // offset should increase by 72 bytes

        // Should be equal to 0x14_00_44_00
        offset += buffer.writeUInt32BE(0x14_00_44_00, offset);

        // Chain ID
        offset += buffer.writeUInt8(effectInfo.chainID, offset);
        // State
        offset += buffer.writeUInt8(effectInfo.state ? 1 : 0, offset);
        // should contain 0f 00 - constant sequence
        offset += buffer.writeUInt16BE(0x0f_00, offset);

        //console.log(buffer.subarray(offset, offset+4));
        // Effect Module ID
        offset += buffer.writeUint32BE(effectInfo.ID, offset);

        // Parameters encoded
        for (let i = 0; i < 15; i = i + 1) {
            const paramEncoded = this.encoder.encodeParamValueFloat(effectInfo.paramValues[i]);
            // Write each byte
            paramEncoded.forEach(b => {
                offset += buffer.writeUint8(b, offset);
            })
        }

        //console.log(offset);
        return offset;
    }

    encodeExpSettings(buffer: Buffer, offset: number, expSettings: IExpSettings): number{

        // Should be equal to 0x0c_00_0c_00
        offset += buffer.writeUInt32BE(0x0c_00_0c_00, offset);

        // ID and Param number combine as nibbles in 1 byte
        const id_paramnumber = ((expSettings.id << 4) & 0xF0) | expSettings.paramNumber;
        offset += buffer.writeUInt8(id_paramnumber, offset);

        // module id and module param id
        offset += buffer.writeUInt8(expSettings.module, offset);
        offset += buffer.writeUInt8(expSettings.moduleParamID, offset);

        // Separation byte - 00
        offset += buffer.writeUInt8(0, offset);

        // Param max and min
        offset += buffer.writeUInt8(expSettings.moduleParamNumberMax, offset);
        offset += buffer.writeUInt8(expSettings.moduleParamNumberMin, offset);


        return offset;
    }

    encodeKnobSettings(buffer: Buffer, offset: number, knobSettings: IKnobSettings): number {

        // Should be equal to 0x10_00_04_00
        offset += buffer.writeUInt32BE(0x0c_00_0c_00, offset);

        // Knob number
        offset += buffer.writeUInt8(knobSettings.number, offset);

        // Knob module ID
        offset += buffer.writeUInt8(knobSettings.module, offset);

        // Knob module param ID
        offset += buffer.writeUInt8(knobSettings.paramID, offset);

        // Separation byte - 00
        offset += buffer.writeUInt8(0, offset);

        return offset
    }

    encodeCtrlSettings(buffer: Buffer, offset: number, ctrlSettings: ICtrlSettings): number {
        // Should be equal to 0x0f_00_08_00
        offset += buffer.writeUInt32BE(0x0f_00_08_00, offset);

        // Ctrl number id
        offset += buffer.writeUInt8(ctrlSettings.number, offset);

        // Ctrl mode
        offset += buffer.writeUInt8(ctrlSettings.mode, offset);

        //should contain 00 00
        offset += buffer.writeUInt16BE(0x00_00, offset);


        // Pedal assignment as bit flags
        let pedalBitFlags = 0;
        for (let i = 0; i < 11; i = i + 1) {
            const mask = ctrlSettings.pedalsAssign[i]
            pedalBitFlags |= mask;
        }
        // Store in little endian
        offset += buffer.writeUInt16LE(pedalBitFlags, offset);


        //should contain 00 00
        offset += buffer.writeUInt16BE(0x00_00, offset);

        return offset;
    }

}