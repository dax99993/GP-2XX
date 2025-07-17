import { BaseSysExMsg, PatchChangeBaseSysEx, SysExHeader } from "@/constants/SysExMsg";
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
        this.midi.inputPort?.addEventListener("midimessage", listener);
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
    }

    decodeSysEx30length(message: Uint8Array | number[]) {
        if ( compareArrays(message.slice(0, 18+1), PatchChangeBaseSysEx.slice(0, 18+1))) {
            console.log("Change preset message received!.");
            this._midiGetChangePreset(message);
        }
    }

    _isSysEx(message: number[] | Uint8Array) {
       return message[0] == 0xf0 && message[message.length - 1] == 0xf7;
    }

    _isGPSysEx(message: number[] | Uint8Array) {
        return this._isSysEx(message) && compareArrays(message.slice(1, SysExHeader.length + 1), SysExHeader);
    }

    // DECODE ACTIONS
    _midiGetChangePreset(message: number[] | Uint8Array): number {
        // We already know this is the kind of message
        let baseSysEx = message;
        const high_byte = baseSysEx[25] 
        const low_byte = baseSysEx[26]

        //console.log("bytes ", high_byte, low_byte);

        const num = ((high_byte & 0x0f) << 4) | (low_byte & 0x0f);
        //console.log("read change preset number = ", num);

        return num;
    }


    // MIDI ENCODE METHODS
    // utils
    _midiEncondeParamValueInt(n: number) {
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
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setUint32(0, res, false);
        const res_uint32le = new Uint32Array([view.getUint32(0, true)]);
        // extract bytes of uint32
        const res_uint8 = new Uint8Array(res_uint32le.buffer);
        let x: number[] = [];
        // idk why they are not reverse, so mannually reverse them
        // Split each byte into 2 bytes containing high and low nibble
        res_uint8.reverse().forEach(b => {
            x.push((b >> 4) & 0x0f);
            x.push((b >> 0) & 0x0f);
        })

        // console.log(base);
        // console.log(m);
        // console.log(diff);
        // console.log("BE", res);
        // console.log("LE", res_uint32le);
        // console.log("UINT8 ",res_uint8);
        // console.log(x);

        return x;
    }

    _midiEncondeParamValueFloat(n: number) {
        // Create an ArrayBuffer with enough space for a Float32 (4 bytes)
        const buffer = new ArrayBuffer(4);
        // Create a DataView to write the Float32 value into the buffer
        const dataView = new DataView(buffer);

        // Write the Float32 value at offset 0 (little-endian by default for DataView)
        dataView.setFloat32(0, n, true); // true for little-endian

        // Create a Uint8Array from the same ArrayBuffer to access the bytes
        const uint8Array = new Uint8Array(buffer);

        // Split bytes into nibbles
        let x: number[] = [];
        uint8Array.forEach(b => {
            x.push((b >> 4) & 0x0f);
            x.push((b >> 0) & 0x0f);
        })

        console.log(uint8Array);
        console.log(x)

        return x; 
    }
    // Preset actions
    _midiSendChangePreset(num: number) {
        // Checks num in range [0, 255]
        // bytes 0x19 and 0x1a encode the preset/patch number (Hex digits)
        let msg = BaseSysExMsg.PresetAction.changePreset;
        const high_byte = (num >> 4) & 0x0f;
        const low_byte = (num) & 0x0f;
        msg[0x19] = high_byte;
        msg[0x1a] = low_byte;

        this.sendSysEx(msg);
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
            encodedValue = this._midiEncondeParamValueFloat(n);
        // should i check explictly for int?
        } else {
            encodedValue = this._midiEncondeParamValueInt(n);
        }

        for (let i = 0; i <= 7; i++) {
            baseSysEx[0x25 + i] = encodedValue[i];
        }

        this.midi.sendMessage(baseSysEx);
    }


}


function compareArrays(a: number[] | Uint8Array, b: number[] | Uint8Array) {
    // console.log("Sizes = ", a.length, b.length);
    return a.length === b.length &&
        a.every((element, index) => element === b[index]);
}