
export class EncoderUtils {
    constructor() {

    }

    // LOW LEVEL Byte Manipulations

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

        //console.log(uint8Array);
        //console.log(nibbles)

        return nibbles; 
    }

    encode16BitTwosComplementToNibbles(num: number) {
        // Ensure the number is within the 16-bit signed integer range
        const n = num & 0xFFFF;

        // Use a DataView to handle the two's complement representation directly
        // Create a 2-byte (16-bit) ArrayBuffer
        const buffer = new ArrayBuffer(2);
        // Create a DataView to manipulate the buffer
        const view = new DataView(buffer);

        // Write the number as a 16-bit signed integer (Int16)
        // The second argument (false) specifies little-endian byte order.
        // Set to true for big-endian.
        view.setInt16(0, n, false);

        // Extract the bytes
        const lowByte = view.getUint8(0); // First byte (low byte in little-endian)
        const highByte = view.getUint8(1); // Second byte (high byte in little-endian)

        console.log(highByte.toString(16), lowByte.toString(16)); // Return as [highByte, lowByte] for common usage
        const [highByteHighNible, highByteLowNible] = this.byteToNibbles(lowByte);
        const [lowByteHighNible, lowByteLowNible] = this.byteToNibbles(highByte);

        console.log(lowByteHighNible, lowByteLowNible, highByteHighNible, highByteLowNible);
        return [lowByteHighNible, lowByteLowNible, highByteHighNible, highByteLowNible];
    }

    encodeEffectIDToNibbles(num: number): number[] {
        // Ensure the number is within the 16-bit signed integer range
        const n = num & 0xFFFFFFFF;

        // Use a DataView to handle the two's complement representation directly
        // Create a 2-byte (16-bit) ArrayBuffer
        const buffer = new ArrayBuffer(4);
        // Create a DataView to manipulate the buffer
        const view = new DataView(buffer);

        // Invert order
        view.setUint32(0, n, true);

        const bytes = [...new Uint8Array(buffer)]

        return this.byteArrayToNibbleArray(bytes)
    }

    encodePresetName(name: string) {
        // convert to ASCII byte array
        const ascii = Array.from(name).map(char => char.charCodeAt(0));
        // split in nibbles
        return this.byteArrayToNibbleArray(ascii);
    }

}