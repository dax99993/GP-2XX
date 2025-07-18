import { BaseSysExMsg, SysExGPHeader } from "@/constants/SysExMsg";
import { MIDIMessageEvent } from "@motiz88/react-native-midi";
import { action, makeObservable, observable } from "mobx";
import { GP200Model } from "./gp200";
import { MidiDevice } from "./midiDevice";

type midiMessage = {
    data: number[];
    timestamp: number;
}

type gpAction = {
    action: number;
    data: number[];
}



export class MidiGPDeviceModel {

    gp: GP200Model;
    midi: MidiDevice;

    messages: midiMessage[];
    message_received_counter: number;

    constructor() {
        this.midi = new MidiDevice();
        this.messages = [];
        this.message_received_counter= 0;

        makeObservable(this, {
            midi: observable,
            messages: observable,

            _midiSendChangePreset: action,
        });
    }

    addGP(gp: GP200Model) {
        this.gp = gp;
    }

    // INTERNAL METHODS
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
            console.log(`Midievent (${this.message_received_counter}) : ${messageHex}`);
            this.message_received_counter++;
            this.decodeReceivedSysEx(incomingMessage);
        };
        
        // add event listener to input
        //this.midi.inputPort?.addEventListener("midimessage", listener);
        this.midi.addMessageListener(listener);
    }
    
    //  --------------------------------------------------------------------------------
    //      UTIL METHODS
    //  ---------------------------------------------------------------------------------
    byteToNibbles(n: number): number[] {
        const high_byte = (n >> 4) & 0x0f;
        const low_byte = (n) & 0x0f;

        return [high_byte, low_byte];
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


    uint8BytesToFloat32(bytes: number[]): number {
        // 'float32Bytes' should be a Uint8Array containing the 4 bytes of Float32 representation
        const float32Bytes = new Uint8Array(bytes);

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
        // should be a Uint8Array containing the 4 bytes of uint32 representation
        const uint32Bytes = new Uint8Array(bytes);

        // 1. Create an ArrayBuffer
        const buffer = new ArrayBuffer(4);

        // 2. Create a Uint8Array view to populate the buffer
        const byteView = new Uint8Array(buffer);
        byteView.set(uint32Bytes); // Copy the bytes into the buffer

        // 3. Create a DataView
        const dataView = new DataView(buffer);

        // 4. Use getUint32() to read the number (assuming little-endian)
        return dataView.getUint32(0, true); // 0 is the offset
    }

    uint32ToUint8Bytes(n : number): Uint8Array {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setUint32(0, n, false);
        // get uint32 in little endian
        const res_uint32le = new Uint32Array([view.getUint32(0, true)]);
        // extract bytes of uint32
        // idk why they are not reverse, so mannually reverse them
        return new Uint8Array(res_uint32le.buffer).reverse();
    }

    encodeParamValueInt(n: number) {
        let base = 0x3f_80_00_00;
        const delta = 0x00_80_00_00;

        if (n < 0) {
            base |= 0x80_00_00_00;
        }

        const N = Math.abs(n);
        // get integer level
        const m = Math.floor(Math.log2(N));

        const diff = N - Math.pow(2, m);

        const res = (base + delta * m) + diff * (delta >> m);
        // convert to res to uint32 little endian
        const res_uint8 = this.uint32ToUint8Bytes(res);
        // Split each byte into 2 bytes containing high and low nibble
        const nibbles = this.byteArrayToNibbleArray(res_uint8);

        return nibbles;
    }

    decodeParamValueInt(encoded: number[]) {
        // Get byte array
        const bytes = this.nibbleArrayToByteArray(encoded);

        // convert to bytes to uint32
        const numberValue = this.uint8BytesToUint32(bytes);
        console.log(numberValue, numberValue.toString(16).padStart(8, '0'));

        // Decode
        // get highest bit for sign
        const bit_mask: number = 0x80_00_00_00
        const sign: number = (numberValue & bit_mask) ? -1 : 1;
        //console.log(sign);

        // Mask bit
        const n = numberValue & (~bit_mask);
        console.log(n, n.toString(16).padStart(8, '0'));

        if (n === 0) {
            return 0;
        }

        const base = 0x3f_80_00_00;
        const delta = 0x00_80_00_00;

        // Create power of 2 encoded levels
        let levels = [];
        for (let i = 0; i < 15; i = i + 1) {
            //console.log(i);
            levels.push(base + i * delta);
        }

        // Get level
        const m: number = levels.findIndex((l: number) => l > n) - 1;
        console.log(m, Math.pow(2, m));

        // Calculate the integer number
        const steps = (n - (base + delta * m)) / (delta >> m)
        console.log(steps)

        return sign * (Math.pow(2, m) + steps);
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

    decodeParamValueFloat(encoded: number[]) {
        // combine pair of encoded bytes (contains nibbles) to form a complete byte
        const bytes = this.nibbleArrayToByteArray(encoded);
        // convert bytes to float32
        const numberValue = this.uint8BytesToFloat32(bytes)

        return numberValue;
    }

    _isSysEx(message: number[] | Uint8Array) {
       return message[0] == 0xf0 && message[message.length - 1] == 0xf7;
    }

    _isGPSysEx(message: number[] | Uint8Array) {
        return this._isSysEx(message) &&
        compareArrays(message.slice(1, SysExGPHeader.length + 1), SysExGPHeader);
    }

    compareMessage(receivedMessage: number[] | Uint8Array, sysExMessage: number[] | Uint8Array, offset: number, length: number): boolean {
        const a = receivedMessage.slice(offset, length + 1);
        const b = sysExMessage.slice(offset, length + 1);
        return compareArrays(a, b)
    }

    isSameMessage(receivedMessage: number[] | Uint8Array, sysExMessage: number[] | Uint8Array): boolean {
        // so far all board received messages are descernible base on the first 19 bytes
        return this.compareMessage(receivedMessage, sysExMessage, 0, 18);
    }

    // DECODE METHODS
    // utils
    decodeReceivedSysEx(message: Uint8Array | number[]) {
       // Parse the message
       // execute corresponding action 
        if (this._isGPSysEx(message)) {
            //console.log("GP SysEx received");
            //console.log(message);
            if (message.length == 30) {
                //console.log("Parsing 30 length message.");
                this.decodeSysEx30length(message);
            } else if (message.length == 46) {
                //console.log("Parsing 46 length message.");
                this.decodeSysEx46length(message);

            } else {
                //console.log("Parsing " + message.length + "length message.");
            }
        }
    }

    decodeSysEx46length(message: Uint8Array | number[]) {
        const changeParameterValue = BaseSysExMsg.EffectActions.changeParameterValue;
        //if ( compareArrays(message.slice(0, 18+1), changeParameterValue.slice(0, 18+1))) {
        if ( this.isSameMessage(message, changeParameterValue)) {
            console.log("Change preset message received!.");
            const [effectChainID, paramId, decodeValue] = this._midiGetChangeEffectParam([...message]);
            console.log("Change parameter value", effectChainID, paramId, decodeValue);
            // update model
            this.gp.changeParamValue(effectChainID, paramId, decodeValue, false);
        }
    }

    decodeSysEx30length(message: Uint8Array | number[]) {
        const changePresetSysEx = BaseSysExMsg.PresetAction.changePreset;
        // Compare to change preset message
        //if ( compareArrays(message.slice(0, 18+1), changePresetSysEx.slice(0, 18+1))) {
        if ( this.isSameMessage(message, changePresetSysEx) ) {
            console.log("Change preset message received!.");
            const preset_num = this._midiGetChangePreset(message);
            this.gp.changePreset(preset_num, false);
        }
    }



    // DECODE ACTIONS
    _midiGetChangePreset(message: number[] | Uint8Array): number {
        // bytes 0x19 and 0x1a encode the preset/patch number (Hex digits)
        let baseSysEx = message;
        const high_byte = baseSysEx[0x19] 
        const low_byte = baseSysEx[0x1a]

        const num = ((high_byte & 0x0f) << 4) | (low_byte & 0x0f);

        return num;
    }


    // MIDI ENCODE METHODS
    // utils
    // Preset actions
    _midiSendChangePreset(num: number) {
        // Checks num in range [0, 255]
        // bytes 0x19 and 0x1a encode the preset/patch number (Hex digits)
        let msg = BaseSysExMsg.PresetAction.changePreset;
        const [high_byte, low_byte] = this.byteToNibbles(num);
        msg[0x19] = high_byte;
        msg[0x1a] = low_byte;

        this.sendSysEx(msg);
    }

    _midiSendChangeChainOrder(preset_num:number, fxSendPos: number, fxReturnPos: number, chainOrder: number[]) {

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
            msg[p+1] = chainOrder[(p-0x1d)/2];
        }

        // Send message        
        this.midi.sendMessage(msg);
    }


    //Effect actions
    _midiChangeEffectState(pedal_id: number, state: boolean) {
        // Check pedal_id in range [0, 10]

        //byte 0x16 is the effect ID (0-10) ; byte 0x18 is the state of pedal OFF -> 0, ON -> 1
        let baseSysEx = BaseSysExMsg.EffectActions.changeState;
        baseSysEx[0x16] = pedal_id;
        baseSysEx[0x18] = state ? 1 : 0;

        this.sendSysEx(baseSysEx);
    }

    _midiSendChangeEffectParam(effectChainID: number, paramId: number, paramType: string, n:number) {

        // byte 0x16 contains the effect chain id (0 to 10)
        // byte 0x18 containes parameter id,
        // bytes 0x25 to 0x2c contains the encoded value
        let baseSysEx = BaseSysExMsg.EffectActions.changeParameterValue;
        baseSysEx[0x16] = effectChainID;
        baseSysEx[0x18] = paramId;

        let encodedValue: number[];
        if (paramType == "float") {
            encodedValue = this.encodeParamValueFloat(n);
        // should i check explictly for int?
        } else {
            encodedValue = this.encodeParamValueInt(n);
        }

        // set the encoded values in message (8 bytes)
        for (let i = 0; i <= 7; i++) {
            baseSysEx[0x25 + i] = encodedValue[i];
        }

        this.midi.sendMessage(baseSysEx);
    }

    _midiGetChangeEffectParam(message: number[]): number[] {
        // byte 0x16 contains the effect chain id (0 to 10)
        // byte 0x18 containes parameter id,
        // bytes 0x25 to 0x2c contains the encoded value
        const baseSysEx = message;
        const effectChainID = baseSysEx[0x16];
        const paramId = baseSysEx[0x18];

        // get encoded values
        const encoded = baseSysEx.slice(0x25, 0x2c + 1);
        
        //get the type for correct decoding
        //DefaultEffectsInfo

        const decodeValue = this.decodeParamValueInt(encoded);

        return [effectChainID, paramId, decodeValue];
    }


}


function compareArrays(a: number[] | Uint8Array, b: number[] | Uint8Array) {
    // console.log("Sizes = ", a.length, b.length);
    return a.length === b.length &&
        a.every((element, index) => element === b[index]);
}