import { ICtrlSettings } from "@/models/preset/ICtrlSettings";
import { IExpSettings } from "@/models/preset/IExpSettings";
import { IKnobSettings } from "@/models/preset/IKnobSettings";
import { IEffectInfo } from "@/models/preset/IPresetInfo";


export class DecoderUtils {

    constructor() {

    }

    // LOW LEVEL Byte Manipulations

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
        //console.log("Decoded float bytes", float32Bytes);

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

    uint8BytesToUint32(bytes: number[]): number {
        // 'float32Bytes' should be a Uint8Array containing the 4 bytes of Float32 representation
        const uint32Bytes = new Uint8Array(bytes);
        //console.log("Decoded float bytes", float32Bytes);

        // 1. Create an ArrayBuffer
        const buffer = new ArrayBuffer(4);

        // 2. Create a Uint8Array view to populate the buffer
        const byteView = new Uint8Array(buffer);
        byteView.set(uint32Bytes); // Copy the bytes into the buffer

        // 3. Create a DataView
        const dataView = new DataView(buffer);

        // 4. Use getFloat32() to read the number (assuming little-endian)
        return dataView.getUint32(0, true); // 0 is the offset
    }

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

    nibblesTo16BitTwosComplement(nibbles: number[]): number {
        // convert nibbles to bytes
        const lowByte = this.nibblesToByte(nibbles[0], nibbles[1]);
        const highByte = this.nibblesToByte(nibbles[2], nibbles[3]);

        // Use a DataView to handle the two's complement representation directly
        // Create a 2-byte (16-bit) ArrayBuffer
        const buffer = new ArrayBuffer(2);
        // Create a DataView to manipulate the buffer
        const view = new DataView(buffer);

        view.setUint8(0, lowByte);
        view.setUint8(1, highByte);

        // Ensure the number is within the 16-bit signed integer range
        //const n = num & 0xFFFF;
        return view.getInt16(0, true);
    }

    // GP DECODE UTILS

    decodeEffectIDNibbles(nibbles: number[]): number {
        // Ensure the number is within the 16-bit signed integer range
        const bytes = this.nibbleArrayToByteArray(nibbles);

        return this.uint8BytesToUint32(bytes);
    }

    decodeParamValueFloat(encoded: number[]) {
        // combine pair of encoded bytes (contains nibbles) to form a complete byte
        const bytes = this.nibbleArrayToByteArray(encoded);
        //console.log("Decoding float32", encoded, bytes);
        // convert bytes to float32
        const numberValue = this.uint8BytesToFloat32(bytes)

        return numberValue;
    }

    decodeParamValue(encoded: number[], isDecimal: boolean): number {
        let decodedValue = this.decodeParamValueFloat(encoded);
        if (isDecimal) {
            // round value to one decimal
            decodedValue = Math.round(decodedValue * 10) / 10;
        } else {
            // remove decimals
            decodedValue = Math.round(decodedValue);
        }

        return decodedValue;
    }



    // PRESET INFORMATION EXTRACTION METHODS
    // ASK PRESET

    decodePanValuePresetInfo(high_nibble: number, low_nibble: number) {
        const low = this.nibblesToByte(high_nibble, low_nibble);
        const high = low <= 0x64 ? 0x00 : 0xff;

        const bytes = [low, high];
        //console.log("Decoding pan value bytes", bytes);

        return this.uint8BytesToInt16TwosComplement(bytes);
    }

    decodeAsciiName(msg: number[]) {
        // each characters is represented in ascii, split in to nibles
        const bytes = this.nibbleArrayToByteArray(msg);

        // map bytes to string
        const name = bytes.map(b => String.fromCharCode(b)).join("");

        // Remove non-ascii and extended ascii characters
        return name.replace(/[^\x00-\x7F]/g, "");
    }

    decodeEffectInfo(msg: number[]): IEffectInfo {
        if (msg.length != 0x90) {
            throw new Error("Effect info msg has to be 0x90 bytes");
        }

        const effectChainID = msg[0x09]
        const effectState = msg[0x0b] !== 0;
        const effectIDNibbles = msg.slice(0x10, 0x17 + 1);
        const effectID = this.decodeEffectIDNibbles(effectIDNibbles);
        let parameterValues = [];
        for(let i = 0x18; i < msg.length; i=i+8) {
            const m = msg.slice(i, i+8);
            parameterValues.push(this.decodeParamValueFloat(m));
        }

        // console.log("Effect Chain ID", effectChainID);
        // console.log("Effect ID", effectID);
        // console.log("Effect State", effectState);
        // console.log("Parameter encoded values\n", parameterValues);

        return {
            chainID: effectChainID,
            ID: effectID,
            state: effectState,
            paramValues: parameterValues
        }
    }

    decodeExpAssignInfo(msg: number[]): IExpSettings {
        const expPedalID = msg[0x8];
        const expPedalParamNumber = msg[0x9];
        const expPedalModule = this.nibblesToByte(msg[0xa], msg[0xb]);
        const expPedalModuleParamID = msg[0xd];
        const maxValue = this.decodeParamValueFloat(msg.slice(0x10, 0x17 + 1));
        const minValue = this.decodeParamValueFloat(msg.slice(0x18, 0x1f + 1));

        //console.log(`Exp ${expPedalID} Param ${expPedalParamNumber} Assign to\nModule ${expPedalModule} Param ${expPedalModuleParamID} range [${minValue}, ${maxValue}]`);

        return {
            id: expPedalID,
            paramNumber: expPedalParamNumber,

            module: expPedalModule,
            moduleParamID: expPedalModuleParamID,
            moduleParamNumberMin: minValue,
            moduleParamNumberMax: maxValue,
        }
    }

    decodeKnobAssignInfo(msg: number[]): IKnobSettings {
        if (msg.length != 0x10) {
            throw new Error ("Knob assign msg has to be 0x10 bytes");
        }

        const knobNumber = msg[0x9];
        const knobModule = this.nibblesToByte(msg[0xa], msg[0xb]);
        const paramID = msg[0xd];

        //console.log(`Knob ${knobNumber} assign to Module ${knobModule} Param ${paramID}`);

        return {
            number: knobNumber,
            module: knobModule,
            paramID: paramID
        };
    }

    decodeCtrlAssignInfo(msg: number[]): ICtrlSettings {
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
        //console.log(`CTRL ${ctrlNumber} mode ${ctrlMode} Assign to pedals ${pedalArray}`);

        return {
            number: ctrlNumber,
            mode: ctrlMode,
            pedalsAssign: pedalArray,
        }
    }
}