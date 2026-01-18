// import { MIDIAccess, MIDIConnectionEvent, MIDIInput, MIDIMessageEvent, MIDIOutput, MIDIPort, requestMIDIAccess } from "@motiz88/react-native-midi";
import { action, makeObservable, observable } from "mobx";
import {
    MIDIAccess,
    MIDIConnectionEvent,
    MIDIInput,
    MIDIMessageEvent,
    MIDIOutput,
    MIDIPort,
    requestMIDIAccess,
} from "react-native-midi";

export class MidiDevice {
  midiAccess?: MIDIAccess = undefined;
  // midi IO
  inputPort?: MIDIInput = undefined;
  outputPort?: MIDIOutput = undefined;

  portID: string;
  connectedPorts: number;

  // TEST
  connectCallback: (isJr: boolean) => void;
  disconnectCallback: () => void;

  midiListener: ((e: MIDIMessageEvent) => any) | undefined;

  constructor(
    connectCallback: (isJr: boolean) => void,
    disconnectCallback: () => void,
  ) {
    this.connectCallback = connectCallback;
    this.disconnectCallback = disconnectCallback;

    this.midiListener = undefined;

    this.portID = "";
    this.connectedPorts = 0;

    makeObservable(this, {
      // midiAccess: observable,
      inputPort: observable,
      outputPort: observable,

      getMidiAccess: action,
      setInput: action,
      setOutput: action,
      unSetInput: action,
      unSetOutput: action,

      sendSysExMessage: action,
      sendCCMessage: action,
    });
  }

  getMidiAccess() {
    // if (this.midiAccess) {
    //     this.midiAccess.onstatechange = null;
    // }
    requestMIDIAccess({ sysex: true }).then(
      this.onMidiSucess.bind(this),
      this.onMidiFailure,
    );
  }

  onMidiSucess(m: MIDIAccess) {
    // Add event listener
    m.addEventListener("statechange", this.onStateChange.bind(this));
    console.log(m);
    this.midiAccess = m;

    // Set input and output if already available
    this.initialConnection();
  }

  onMidiFailure(msg: string) {
    console.log("Midi access request failed!.", msg);
  }

  initialConnection() {
    if (!this.midiAccess) {
      return;
    }

    let inputPort = undefined;
    for (const [id, input] of this.midiAccess.inputs) {
      if (input.name.includes("GP-200")) {
        input.open();
        inputPort = input as MIDIPort;
        break;
      }
    }

    let outputPort = undefined;
    for (const [id, output] of this.midiAccess.outputs) {
      if (output.name.includes("GP-200")) {
        output.open();
        outputPort = output as MIDIPort;
        break;
      }
    }

    // Force an event so, midi input and output are initialized in the same way, as when reconnected!.
    if (inputPort && outputPort) {
      //console.log("Trying to dispatch Event");
      const e1 = new MIDIConnectionEvent("statechange", { port: inputPort });
      const e2 = new MIDIConnectionEvent("statechange", { port: outputPort });
      this.midiAccess.dispatchEvent(e1 as unknown as Event);
      this.midiAccess.dispatchEvent(e2 as unknown as Event);
    }
  }

  onStateChange(e: MIDIConnectionEvent) {
    let port = e.port;
    //console.log("Midi State Change", e);

    if (!port) {
      console.log("Connection even Port is NULL");
      return;
    }

    if (
      port.state === "disconnected" &&
      port.id !== "" &&
      port.name.includes("GP-200") &&
      port.id == this.portID
    ) {
      // handle disconnection
      console.log(`Port ${port.type} (${port.id}) disconnected`);
      this.portID = "";
      this.connectedPorts = 0;
      console.log("Disconnected device should be set only once!");
      console.log("set output id to", this.portID);
      // If either input or output disconnects unset both ports
      this.unSetInput();
      this.unSetOutput();
      console.log("INPUT PORT ", this.inputPort);
      console.log("OUTPUT PORT ", this.outputPort);
      // Execute disconnect Callback
      this.disconnectCallback();
    } else if (
      port.state === "connected" &&
      port.id !== "" &&
      port.name.includes("GP-200") &&
      port.id != this.portID &&
      this.connectedPorts < 2
    ) {
      // handle re-connection
      console.log(`Port ${port.type} (${port.id}) [${port.name}] connected`);
      this.connectedPorts++;
      if (port.type == "input") {
        console.log("set input port id to", port.id);
        this.setInput(port.id);
      } else {
        console.log("set output port id to", port.id);
        this.setOutput(port.id);
      }

      if (this.connectedPorts == 2) {
        console.log("Connected device should be set only once!");
        console.log("set ports id to", this.portID);
        console.log("INPUT PORT ", this.inputPort);
        console.log("OUTPUT PORT ", this.outputPort);
        this.portID = port.id;
        // Execute Connect Callback
        this.connectCallback(port.name.toUpperCase().includes("JR"));
      }
    }
  }

  unSetInput() {
    // Need to remove event onmidimessage handler so garbage collector can reuse memory
    if (this.inputPort) {
      //this.inputPort.onstatechange = null;
      this.inputPort.onmidimessage = null;
    }

    this.inputPort = undefined;
  }

  unSetOutput() {
    if (this.outputPort) {
      //this.outputPort.onstatechange = null;
    }
    this.outputPort = undefined;
  }

  setInput(inputID: string) {
    //this.unSetInput();
    this.inputPort = this.midiAccess?.inputs.get(inputID);
    // Should I add the event handler here?
    if (this.inputPort && this.midiListener && !this.inputPort.onmidimessage) {
      console.log("MIDI LISTENER ADDED");
      this.inputPort.addEventListener("midimessage", this.midiListener);
    }
  }

  setOutput(outputID: string) {
    //this.unSetOutput();
    this.outputPort = this.midiAccess?.outputs.get(outputID);
  }

  sendSysExMessage(message: Uint8Array | number[]) {
    console.log(`SEND (${message.length}):\t[${message}]`);
    // if (!this.outputPort) {
    //     throw new Error("Output Port should be defined when sending a message");
    // }
    this.outputPort?.send(message);
  }

  sendCCMessage(controllerNumber: number, value: number, channel: number) {
    this.outputPort?.send([0xb0 + channel, controllerNumber, value]);
  }

  addMIDIMessageListener(listener: (e: MIDIMessageEvent) => any) {
    this.midiListener = listener;
  }
}
