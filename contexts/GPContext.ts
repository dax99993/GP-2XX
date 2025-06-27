import { MIDIAccess, MIDIInput, MIDIOutput, requestMIDIAccess } from "@motiz88/react-native-midi";
import { createContext, useContext } from "react";

export class GPMidi {
    private midiInput: MIDIInput | null = null;
    public midiOutput: MIDIOutput | null = null;
    private midiAccess: MIDIAccess | null = null;

    private getDevice() {
        if (!this.midiAccess) return;

        // Get GP-200 input and output
        for (const entry of this.midiAccess.inputs) {
            const input = entry[1];
            if (input.name.includes("GP-200")) {
                this.midiInput = input;
                this.midiInput.onmidimessage = (e) => {
                    console.log("Message", e.data);
                };
            }
        }

        for (const entry of this.midiAccess.outputs) {
            const output = entry[1];
            if (output.name.includes("GP-200")) {
                this.midiOutput = output;
            }
        }
    }

    constructor() {
        requestMIDIAccess({ software: false, sysex: true }).then((midiAccess) => {
            console.log("Request midi access");
            // Use midiAccess.inputs and midiAccess.outputs
            this.midiAccess = midiAccess;
            this.midiAccess.onstatechange = (event) => {
                console.log("Onstate change", event.port?.name, event.port?.manufacturer, event.port?.state);
                this.getDevice();
            };
            console.log(midiAccess);
            console.log(midiAccess.inputs);
            console.log(midiAccess.outputs);
        });
    }
    
    public sendMessage(data: number[] | Uint8Array) {
        this.midiOutput?.send(data);
    }

    public readMessage() {
        //this.midiInput?.onmidimessage = (message) => {
        //    console.log(message.data);
        //};
        //this.midiInput?.addEventListener
    }
}

export const GPContext = createContext<GPMidi | null>(null);

export function useGPContext() {
    
    const gpmidi = useContext(GPContext);

    if (!gpmidi) {
        throw new Error("useGPContext must be used with GPContext");
    }

    return gpmidi;
}