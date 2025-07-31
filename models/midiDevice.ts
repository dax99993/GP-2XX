import { MIDIAccess, MIDIConnectionEvent, MIDIInput, MIDIMessageEvent, MIDIOutput, requestMIDIAccess } from "@motiz88/react-native-midi";
import { action, makeObservable, observable } from "mobx";

export class MidiDevice {
    midiAccess?: MIDIAccess = undefined;
    // midi IO
    inputPort?: MIDIInput = undefined;
    outputPort?: MIDIOutput = undefined;

    constructor() {
        makeObservable(this, {
            midiAccess: observable,
            inputPort: observable,
            outputPort: observable,

            getMidiAccess: action,
            setInput: action,
            setOutput: action,
            unSetInput: action,
            unSetOutput: action,

            sendMessage: action,
        });
     }

    getMidiAccess() {
        requestMIDIAccess({ sysex: true }).then(this.onMidiSucess.bind(this), this.onMidiFailure);
    }

    onMidiSucess(m: MIDIAccess) {
        // Add event listener
        m.addEventListener("statechange", this.onStateChange.bind(this));
        console.log(m);
        this.midiAccess = m;
        //this.midiAccess.addEventListener("statechange", this.onStateChange.bind(this));
        
        // Set input and output if already available
        this.initialConnectionInput();
        this.initialConnectionOutput();

        //console.log(this.midiAccess.inputs);
        //console.log(this.midiAccess.outputs);
    }

    onMidiFailure(msg: string) {
        console.log("Midi access request failed!.", msg);
    }

    initialConnectionInput() {
        if (!this.midiAccess) {return}

        for(const[id, input] of this.midiAccess.inputs) {
            if (input.name.includes("GP-200")) {
                this.setInput(id);
            }
        }
    }

    initialConnectionOutput() {
        if (!this.midiAccess) {return}

        for(const[id, output] of this.midiAccess.outputs) {
            if (output.name.includes("GP-200")) {
                this.setOutput(id);
            }
        }

    }

    onStateChange(e: MIDIConnectionEvent) {
        let port = e.port;
        console.log("Midi State Change", e);

        if(!port) {
            console.log("Connection even Port is NULL");
        }

        if (port?.state === "disconnected") {
            console.log(`Port ${port} (${port.id}) disconnected`);
            // handle disconnection
            if (port.type =="input" && port.name.includes("GP-200") ) {
                console.log(`Unregister (${port.id}) ${port.name} INPUT`);
                this.unSetInput();
            }
            if (port.type =="output" && port.name.includes("GP-200") ) {
                console.log(`Unregister (${port.id}) ${port.name} OUTPUT`);
                this.unSetOutput();
            }
        } else if ( port?.state === "connected") {
            console.log(`Port ${port} (${port.id}) [${port.name}] connected`);
            // handle re-connection
            if (port.type =="input" && port.name.includes("GP-200")) {
                console.log(`Register ${port.name} INPUT`);
                this.setInput(port.id);
            }
            if (port.type =="output" && port.name.includes("GP-200")) {
                console.log(`Register (${port.id}) ${port.name} OUTPUT`);
                this.setOutput(port.id);
            }
        }
    }

    unSetInput() {
        this.inputPort = undefined;
    }

    unSetOutput() {
        this.outputPort = undefined;
    }

    setInput(input: string) {
        this.inputPort = this.midiAccess?.inputs.get(input)
    }

    setOutput(output: string) {
        this.outputPort = this.midiAccess?.outputs.get(output)
    }

    sendMessage(message: Uint8Array | number[]) {
        console.log("Sending = ", message);
        this.outputPort?.send(message);
    }

    addMessageListener(listener: (e: MIDIMessageEvent)=> any) {
        this.inputPort?.addEventListener("midimessage", listener);
    }

}