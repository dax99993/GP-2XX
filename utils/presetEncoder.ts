import { ICtrlSettings } from "@/models/preset/ICtrlSettings";
import { IExpSettings } from "@/models/preset/IExpSettings";
import { IKnobSettings } from "@/models/preset/IKnobSettings";
import { IEffectInfo, IPresetInfo } from "@/models/preset/IPresetInfo";
import { EncoderUtils } from "./encodeUtils";

export class PresetEncoder {
    encoder: EncoderUtils;

    constructor() {
        this.encoder = new EncoderUtils();
    }

    encodePresetBinaryFile(presetInfo: IPresetInfo): Uint8Array {
        console.log("Start Encoding");
        let offset = 0;
        const bytes = new Uint8Array(1224);
        console.log("PRST byte length:", bytes.byteLength);

        // Get prst metadata 52 bytes
        console.log("Get PRST header");
        const metadata = this.encodePresetHeader();

        // Get psrt data 1164 bytes
        console.log("Get PRST data");
        const presetData = this.encodePresetData(presetInfo);

        // Get prst end bytes 8 bytes
        console.log("Get PRST end bytes");
        const endBytes = this.encodePresetEndBytes();

        // Write header, data and end bytes
        bytes.set(metadata, 0);
        console.log("PRST header written");
        bytes.set(presetData, metadata.length);
        console.log("PRST data written");
        bytes.set(endBytes, metadata.length + presetData.length);
        console.log("PRST end bytes written.");
        
        return bytes;
    }

    encodePresetHeader() {
        // WRITE METADATA 52 BYTES
        const metadata = [
            // TRSP (header) ; 0
            0x54, 0x53, 0x52, 0x50, 0x00, 0x00, 0x00, 0x00,
            // 6 ; 0
            0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x00,
            // GP-Model ; 
            0x32, 0x2d, 0x50, 0x47, 0x00, 0x01, 0x01, 0x00,
            // This bytes are diffent always maybe a timestamp
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            // Sequence 1 ; Sequence 2
            0x28, 0x00, 0x00, 0x00, 0x94, 0x04, 0x00, 0x00,
            // PARM in LE ; Sequence 2
            0x4d, 0x52, 0x41, 0x50, 0x94, 0x04, 0x00, 0x00,
            // The first byte changes
            0x28, 0x00, 0x58, 0x00, 
            ];
        
        return new Uint8Array(metadata);
    }

    encodePresetEndBytes() {
        // END BYTES 8
        const endBytes = [
            0xc0, 0x04, 0x00, 0x00,
            // Last two bytes change 
            // 0x00, 0x00, 0x48, 0x10
            0x00, 0x00, 0x00, 0x00
        ];

        // Convert to uint8array 
        return new Uint8Array(endBytes);
    }

    encodePresetData(presetInfo: IPresetInfo): Uint8Array {
        console.log("Start Encoding Preset Data");

        let offset = 0;
        const buffer = new ArrayBuffer(1164);
        const view = new DataView(buffer);
        console.log("Buffer byte length:", buffer.byteLength);

        // preset number
        view.setUint8(offset, presetInfo.number);
        offset += 1;

        // Preset bpm, volume and pan
        view.setInt16(offset, presetInfo.bpm);
        offset += 2;

        view.setInt16(offset, presetInfo.volume);
        offset += 2;

        view.setInt16(offset, presetInfo.pan);
        offset += 2;

        // Preset category
        view.setInt16(offset, presetInfo.category);
        offset += 2;

        // FX send level, return level, mode
        view.setUint16(offset, presetInfo.fxloop.sendLevel);
        offset += 2;

        view.setUint16(offset, presetInfo.fxloop.returnLevel);
        offset += 2;

        view.setUint16(offset, presetInfo.fxloop.mode);
        offset += 2;

        // Separation byte - 00
        view.setUint8(offset, 0);
        offset += 1;

        // 16 bytes
        console.log("Offset before preset name:", offset, offset.toString(16).padStart(4, "0"));


        // Preset name is encoded as 16 ascii characters
        // const presetName: string = String.fromCharCode(...buffer.subarray(offset, offset + 16));
        const presetName: string = presetInfo.name.padEnd(16, '\0');
        for (let i=0; i<presetName.length; i=i+1) {
            view.setUint8(offset, presetName.charCodeAt(i));
            offset += 1;
        }
        // 32 bytes
        console.log("Offset after preset name:", offset, offset.toString(16).padStart(4, "0"));

        // Preset Author is encoded as 16 ascii characters
        // const presetAuthor: string = String.fromCharCode(...buffer.subarray(offset, offset + 16));
        const presetAuthor: string = presetInfo.author.padEnd(16, '\0');
        for (let i=0; i < presetAuthor.length; i=i+1) {
            view.setUint8(offset, presetAuthor.charCodeAt(i));
            offset += 1;
        }
        // 48 bytes
        console.log("Offset after preset author:", offset, offset.toString(16).padStart(4, "0"));

        // Preset Author is encoded as 30 ascii characters ; maybe is 32 characters
        // const presetNote: string = String.fromCharCode(...buffer.subarray(offset, offset + 30));
        const presetNote: string = presetInfo.note.padEnd(32, '\0');
        for (let i=0; i < presetNote.length; i=i+1) {
            view.setUint8(offset, presetNote.charCodeAt(i));
            offset += 1;
        }
        // 80 bytes
        console.log("Offset after preset note:", offset, offset.toString(16).padStart(4, "0"));

        //should contain 00 00 00 00 
        view.setUint32(offset, 0);
        offset += 4;
        //should contain 00 00 00 00
        view.setUint32(offset, 0);
        offset += 4;
        //should can be 08 00 10 00 or some other numbers IDK what this mean
        view.setUint32(offset, 0x08_00_10_00);
        offset += 4;
        // 92 bytes

        // I think this byte is the preset position where it is currently stored
        view.setUint8(offset, presetInfo.number);
        offset += 1;

        // Separation byte - 00
        view.setUint8(offset, 0);
        offset += 1;
        // 94 bytes
        console.log("Offset before FX chain positions:", offset, offset.toString(16).padStart(4, "0"));


        // FX send and return position
        view.setUint8(offset, presetInfo.fxloop.sendPosition);
        offset += 1;
        view.setUint8(offset, presetInfo.fxloop.returnPosition);
        offset += 1;

        // 96 bytes

        // Effect Chain
        presetInfo.effectsChainOrder.filter(n => n >= 0 ).forEach(ID => {
            view.setUint8(offset, ID);
            offset += 1;
        })

        // Separation byte - 00
        view.setUint8(offset, 0);
        offset += 1;
        // 108 bytes

        console.log("Offset starting effect module information", offset, offset.toString(16).padStart(4, "0"));


        // EFFECT MODULE DETAILS 
        for (let i = 0; i < 11; i = i + 1) {
            // Each block is 72 bytes
            offset = this.encodeEffectModule(view, offset, presetInfo.effects[i]);
            // offset += 72;
            console.log("Effect module", i, "offset:", offset.toString(16).padStart(4, "0"));
        }

        console.log("OFFSET after effect module", offset, offset.toString(16).padStart(4, "0"));

        // EXP Settings

        // 3 types of EXP and each has 3 settings
        for (let i = 0; i < 3; i = i + 1) {
            // Each block is 16 bytes
            offset = this.encodeExpSettings(view, offset, presetInfo.exp1A[i]);
            // offset += 16;
            console.log("OFFSET after EXP 1A Param", i, offset, offset.toString(16).padStart(4, "0"));
        }
        for (let i = 0; i < 3; i = i + 1) {
            // Each block is 16 bytes
            offset = this.encodeExpSettings(view, offset, presetInfo.exp1B[i]);
            // offset += 16;
            console.log("OFFSET after EXP 1B Param", i, offset, offset.toString(16).padStart(4, "0"));
        }
        for (let i = 0; i < 3; i = i + 1) {
            // Each block is 16 bytes
            offset = this.encodeExpSettings(view, offset, presetInfo.exp2[i]);
            // offset += 16;
            console.log("OFFSET after EXP 2 Param", i, offset, offset.toString(16).padStart(4, "0"));
        }
        console.log("OFFSET after EXP", offset, offset.toString(16).padStart(4, "0"));


        // Knob settings
        // Each block is 8 bytes
        offset = this.encodeKnobSettings(view, offset, presetInfo.knob1);
        // offset += 8;
        console.log("OFFSET after Knob 1", offset, offset.toString(16).padStart(4, "0"));
        offset = this.encodeKnobSettings(view, offset, presetInfo.knob2);
        // offset += 8;
        console.log("OFFSET after Knob 2", offset, offset.toString(16).padStart(4, "0"));
        offset = this.encodeKnobSettings(view, offset, presetInfo.knob3);
        // offset += 8;
        console.log("OFFSET after Knob 3", offset, offset.toString(16).padStart(4, "0"));

        console.log("OFFSET after Knobs", offset, offset.toString(16).padStart(4, "0"));

        // CTRL settings
        // Each block is 12 bytes
        offset = this.encodeCtrlSettings(view, offset, presetInfo.ctrl1);
        // offset += 12;
        console.log("OFFSET after CTRL 1", offset, offset.toString(16).padStart(4, "0"));
        offset = this.encodeCtrlSettings(view, offset, presetInfo.ctrl2);
        // offset += 12;
        console.log("OFFSET after CTRL 2", offset, offset.toString(16).padStart(4, "0"));
        offset = this.encodeCtrlSettings(view, offset, presetInfo.ctrl3);
        // offset += 12;
        console.log("OFFSET after CTRL 3", offset, offset.toString(16).padStart(4, "0"));
        offset = this.encodeCtrlSettings(view, offset, presetInfo.ctrl4);
        // offset += 12;
        console.log("OFFSET after CTRL 4", offset, offset.toString(16).padStart(4, "0"));
        offset = this.encodeCtrlSettings(view, offset, presetInfo.ctrl5);
        // offset += 12;
        console.log("OFFSET after CTRL 5", offset, offset.toString(16).padStart(4, "0"));
        offset = this.encodeCtrlSettings(view, offset, presetInfo.ctrl6);
        // offset += 12;
        console.log("OFFSET after CTRL 6", offset, offset.toString(16).padStart(4, "0"));
        offset = this.encodeCtrlSettings(view, offset, presetInfo.ctrl7);
        // offset += 12;
        console.log("OFFSET after CTRL 7", offset, offset.toString(16).padStart(4, "0"));
        offset = this.encodeCtrlSettings(view, offset, presetInfo.ctrl8);
        // offset += 12;
        console.log("OFFSET after CTRL 8", offset, offset.toString(16).padStart(4, "0"));

        console.log("OFFSET end of data", offset, offset.toString(16).padStart(4, "0"));

        // Convert to uint8array 1164 bytes
        return new Uint8Array(buffer);
    }


    encodeEffectModule(view: DataView, offset: number, effectInfo: IEffectInfo): number {
        // offset should increase by 72 bytes
        console.log("Effect module offset", offset);

        // Should be equal to 0x14_00_44_00
        view.setUint32(offset, 0x14_00_44_00);
        offset += 4;

        // Chain ID
        view.setUint8(offset, effectInfo.chainID);
        offset += 1;
        // State
        view.setUint8(offset, effectInfo.state ? 1 : 0);
        offset += 1;
        // should contain 0f 00 - constant sequence
        view.setUint16(offset, 0x0f_00);
        offset += 2;

        // Effect Module ID Little Endian
        view.setUint32(offset, effectInfo.ID, true);
        offset += 4;

        // 12 bytes

        // Parameters encoded (60 bytes)
        for (let i = 0; i < 15; i = i + 1) {
            const paramEncoded = this.encoder.float32ToUint8Bytes(effectInfo.paramValues[i]);
            // Write each byte (4 bytes per encoded param)
            paramEncoded.forEach(b => {
                view.setUint8(offset, b);
                offset += 1;
            })
        }

        // 72 bytes

        //console.log(offset);
        return offset;
    }

    encodeExpSettings(view: DataView, offset: number, expSettings: IExpSettings): number{
        console.log("EXP offset", offset);

        // Should be equal to 0x0c_00_0c_00
        view.setUint32(offset, 0x0c_00_0c_00);
        offset += 4;

        // ID and Param number combine as nibbles in 1 byte
        const id_paramnumber = ((expSettings.id << 4) & 0xF0) | (expSettings.paramNumber & 0x0F);
        view.setUint8(offset, id_paramnumber);
        offset += 1;

        // module id and module param id
        view.setUint8(offset, expSettings.module);
        offset += 1;
        view.setUint8(offset, expSettings.moduleParamID);
        offset += 1;

        // Separation byte - 00
        view.setUint8(offset, 0);
        offset += 1;

        // 8 bytes

        // Param max and min
        const encodedMax = this.encoder.float32ToUint8Bytes(expSettings.moduleParamNumberMax);
        encodedMax.forEach(b => {
            view.setUint8(offset, b);
            offset += 1;
        })
        // 12 bytes
        const encodedMin = this.encoder.float32ToUint8Bytes(expSettings.moduleParamNumberMin);
        encodedMin.forEach(b => {
            view.setUint8(offset, b);
            offset += 1;
        })
        // 16 bytes

        return offset;
    }

    encodeKnobSettings(view: DataView, offset: number, knobSettings: IKnobSettings): number {
        console.log("Knob offset", offset);

        // Should be equal to 0x10_00_04_00
        view.setUint32(offset, 0x10_00_04_00);
        offset += 4;

        // Knob number
        view.setUint8(offset, knobSettings.number);
        offset += 1;

        // Knob module ID
        view.setUint8(offset, knobSettings.module);
        offset += 1;

        // Knob module param ID
        view.setUint8(offset, knobSettings.paramID);
        offset += 1;

        // Separation byte - 00
        view.setUint8(offset, 0);
        offset += 1;

        // 8 bytes

        return offset
    }

    encodeCtrlSettings(view: DataView, offset: number, ctrlSettings: ICtrlSettings): number {
        console.log("CTRL offset", offset);

        // Should be equal to 0x0f_00_08_00
        view.setUint32(offset, 0x0f_00_08_00);
        offset += 4;

        // Ctrl number id
        view.setUint8(offset, ctrlSettings.number);
        offset += 1;

        // Ctrl mode
        view.setUint8(offset, ctrlSettings.mode);
        offset += 1;

        //should contain 00 00
        view.setUint16(offset, 0);
        offset += 2;
        
        // 8 bytes

        // Pedal assignment as bit flags
        let pedalBitFlags = 0;
        for (let i = 0; i < 11; i = i + 1) {
            const mask = ctrlSettings.pedalsAssign[i]
            pedalBitFlags |= mask;
        }
        // Store in little endian
        view.setUint16(offset, pedalBitFlags, true);
        offset += 2;


        //should contain 00 00
        view.setUint16(offset, 0);
        offset += 2;
        // 12 bytes

        return offset;
    }
}