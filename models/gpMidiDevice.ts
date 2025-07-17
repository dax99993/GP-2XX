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


}


function compareArrays(a: number[] | Uint8Array, b: number[] | Uint8Array) {
    // console.log("Sizes = ", a.length, b.length);
    return a.length === b.length &&
        a.every((element, index) => element === b[index]);
}