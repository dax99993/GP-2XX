import { MIDIAccess, MIDIConnectionEvent, MIDIInput, MIDIMessageEvent, MIDIOutput, requestMIDIAccess } from "@motiz88/react-native-midi";
import { action, makeObservable, observable } from "mobx";

export class MidiDevice {
    // midi IO
    inputPort?: MIDIInput = undefined;
    outputPort?: MIDIOutput = undefined;

    midiAccess?: MIDIAccess = undefined;

    inputs?: Map<string, MIDIInput> = undefined;
    outputs?: Map<string, MIDIOutput> = undefined;

    constructor() {
        makeObservable(this, {
            midiAccess: observable,
            inputs: observable,
            outputs: observable,
            inputPort: observable,
            outputPort: observable,

            getMidiAccess: action,
            setInput: action,
            setOutput: action,

            sendMessage: action,
        });
     }

    getMidiAccess() {
        // let onMidiSucess = (m: MIDIAccess) => {
        //     console.log(m);
        //     //m.onstatechange = this.onStateChange;
        //     this.midiAccess = m;
        //     //this.midiAccess.onstatechange = this.onStateChange;
        //     this.midiAccess.addEventListener("statechange", this.onStateChange);

        //     // Register available inputs and outputs
        //     this.inputs = new Map(this.midiAccess.inputs);
        //     this.outputs = new Map(this.midiAccess.outputs);
        // };
        requestMIDIAccess({ sysex: true}).then(this.onMidiSucess.bind(this), this.onMidiFailure);
    }

    onMidiSucess(m: MIDIAccess) {
        console.log(m);
        //m.onstatechange = this.onStateChange;
        this.midiAccess = m;
        //this.midiAccess.onstatechange = this.onStateChange;
        this.midiAccess.addEventListener("statechange", this.onStateChange.bind(this));
        
        // Register available inputs and outputs
        this.inputs = new Map(this.midiAccess.inputs);
        this.outputs = new Map(this.midiAccess.outputs);
    }

    onMidiFailure(msg: string) {
        console.log("Midi access request failed!.", msg);
    }

    onStateChange(e: MIDIConnectionEvent) {
        let port = e.port;
        if (port?.state === "disconnected") {
            console.log(`Port ${port} (${port.id}) disconnected`);
            // handle disconnection

        } else if ( port?.state === "connected") {
            console.log(`Port ${port} (${port.id}) connected`);
            // handle Re-request Midi Access to get updated ports
            this.getMidiAccess();
        }
    }

    setInput(input: string) {
        this.inputPort = this.inputs?.get(input)
    }

    setOutput(output: string) {
        this.outputPort = this.outputs?.get(output)
    }

    handleDeviceChange(e: MIDIConnectionEvent) {
        console.log("MIDI state change");
        console.log("MIDI connection event", e);
        if (e.port?.id === this.inputPort?.id) {
            console.log("Change in device!");
        }
        // if (e.port?.type === "input") {
        //     const input = e.port as MIDIInput;
        //     console.log("change input = ", input);
        //     if (input.state == "disconnected") {
        //         //this.inputs?.delete(input.id);
        //     } else {
        //         //this.inputs?.delete(input.id);
        //         //this.inputs?.set(input.id, input);
        //     }
        // } else {
        //     const output = e.port as MIDIOutput;
        //     console.log("change output = ", output);
        //     if (output.state == "disconnected") {
        //         //this.outputs?.delete(output.id);
        //         console.log("device disconnected")
        //     } else {
        //         console.log("device connected")
        //         //this.outputs?.delete(output.id);
        //         //this.outputs?.set(output.id, output);
        //     }
        // }
        console.log("Device = ", e.port?.name, e.port?.type, e.port?.state);
        // console.log("inputs = ", this.inputs);
        // console.log("outputs = ", this.outputs);
    }

    sendMessage(message: Uint8Array | number[]) {
        console.log("Sending = ", message);
        this.outputPort?.send(message);
    }

    addMessageListener(listener: (e: MIDIMessageEvent)=> any) {
        this.inputPort?.addEventListener("midimessage", listener);
    }

    // getMessage(e: MIDIMessageEvent) {
    //     console.log(e.data, e.timeStamp);
    // }
}

//export const midiDevice = new MidiDevice();