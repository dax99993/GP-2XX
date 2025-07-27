import { BaseSysExMsg, SysExGPHeader } from "@/constants/SysExMsg";
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


type midiMessage = {
    data: number[];
    timestamp: number;
}



export class GP200DeviceActions implements IDeviceActions {

    gp200: GP200Model;
    midi: MidiDevice;

    messages: midiMessage[];
    message_received_counter: number;

    constructor(gp200: GP200Model, midi: MidiDevice) {
        this.midi = midi;
        this.gp200 = gp200;

        this.messages = [];
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
            console.log(`Midievent (${this.message_received_counter}) : ${messageHex}`);
            //this.message_received_counter++;
            this.decodeReceivedSysEx(incomingMessage);
        };
        
        // add event listener to input
        //this.midi.inputPort?.addEventListener("midimessage", listener);
        this.midi.addMessageListener(listener);
    }


    // Util methods

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
        console.log("Sign bit masked", n, n.toString(16).padStart(8, '0'));

        if (n === 0) {
            return 0;
        }

        const base = 0x3f_80_00_00;
        const delta = 0x00_80_00_00;

        // Create power of 2 encoded levels
        let levels = [];
        for (let i = 0; i < 16; i = i + 1) {
            //console.log(i);
            levels.push(base + i * delta);
        }

        // Get level
        const m: number = levels.findIndex((l: number) => l > n) - 1;
        console.log("Number Level", m, "power of 2", Math.pow(2, m));

        // Calculate the integer number
        const steps = (n - (base + delta * m)) / (delta >> m)
        console.log(steps)

        return sign * (Math.pow(2, m) + steps);
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


    // MIDI DECODE METHODS

    decodeReceivedSysEx(message: Uint8Array | number[]) {
       // Parse the message
       // execute corresponding action 
        if (this._isGPSysEx(message)) {
            //console.log("GP SysEx received");
            //console.log(message);
            if (message.length == 46) {
                this.decodeSysEx46length(message);
            } else if (message.length == 38) {
                this.decodeSysEx38length(message);
            } else if (message.length == 30) {
                this.decodeSysEx30length(message);
            } else {
                //console.log("Parsing " + message.length + "length message.");
            }
        }
    }

    decodeSysEx46length(message: Uint8Array | number[]) {
        const changeParameterValue = BaseSysExMsg.EffectActions.changeParameterValue;
        //if ( compareArrays(message.slice(0, 18+1), changeParameterValue.slice(0, 18+1))) {
        if ( this.isSameMessage(message, changeParameterValue)) {
            console.log("Change Parameter Value message received!.");
            this.ChangeEffectParamValue(message);
        }
    }

    decodeSysEx38length(message: Uint8Array | number[]) {
        const changeEffect = BaseSysExMsg.EffectActions.changeEffect;
        //if ( compareArrays(message.slice(0, 18+1), changeParameterValue.slice(0, 18+1))) {
        if ( this.isSameMessage(message, changeEffect)) {
            console.log("Change Effect message received!.");
            this.ChangeEffect(message);
        }
    }

    decodeSysEx30length(message: Uint8Array | number[]) {
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

        const num = ((high_byte & 0x0f) << 4) | (low_byte & 0x0f);

        // Update model
        this.gp200.current_preset_number = num;
    }

    //PRESET SETTINGS ACTIONS

    // EFFECT ACTIONS
    ChangeEffect(message: number[] | Uint8Array) {
        // 38 bytes 
        // byte 0x16 is the effect ID (0-10) ; bytes 0x1d to 0x24 are the effect ID
        const pedalID = message[0x16];
        const effectID = message.slice(0x1d, 0x24 + 1);
        console.log("MIDI CHANGE EFFECT ID", effectID);

        // Update model
        this.gp200.changeEffectByID(effectID as number[], pedalID);
    }

    ChangeEffectState(message: number[] | Uint8Array ) {
        //byte 0x16 is the effect ID (0-10) ; byte 0x18 is the state of pedal OFF -> 0, ON -> 1
        const pedal_id = message[0x16];
        const state = message[0x18] != 0;

        // Update model
        this.gp200.current_preset.effects[pedal_id].state = state;
    }

    ChangeEffectParamValue(message: number[] | Uint8Array) {
        // byte 0x16 contains the effect chain id (0 to 10)
        // byte 0x18 containes parameter id,
        // bytes 0x25 to 0x2c contains the encoded value
        const baseSysEx = message;
        const effectChainID = baseSysEx[0x16];
        const paramId = baseSysEx[0x18];

        // get encoded value bytes
        const encoded = baseSysEx.slice(0x25, 0x2c + 1) as number[];
        
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
            decodedValue = this.decodeParamValueInt(encoded);
        }

        console.log(`Change parameter ${paramType} :`, effectChainID, paramId, decodedValue);

        // Update model
        this.gp200.changeParamValue(effectChainID, paramId, decodedValue);
    }



}

