import { changeEffectState, PatchChangeBaseSysEx, SysExHeader } from "@/constants/SysExMsg";
import { MIDIInput, MIDIMessageEvent, MIDIOutput } from "@motiz88/react-native-midi";

import { action, makeObservable, observable } from "mobx";
import { Effect } from "./effect/effect";
import { default_preset, Preset } from "./preset";



function compareArrays(a: number[] | Uint8Array, b: number[] | Uint8Array) {
    // console.log("Sizes = ", a.length, b.length);
    return a.length === b.length &&
        a.every((element, index) => element === b[index]);
}


class GP200Model {

    // MIDI communication
    private inputPort: MIDIInput;
    private outputPort: MIDIOutput;


    //
    //presets: Preset[];
    current_preset: Preset;
    current_preset_number: number;

    current_effect: Effect;

    // Internal props
    message_received_counter: number;

    constructor() {

        // initialize internal values
        this.current_preset_number = 0;

        this.message_received_counter = 0;

        // Just to test
        this.current_preset = default_preset;
        //console.log(JSON.stringify(default_preset));
        this.current_effect = default_preset.nr;

        makeObservable(this, {
            current_preset_number: observable,
            current_effect: observable,
            // Change preset actions
            incrementPresetNum: action,
            decrementPresetNum: action,
            changePreset: action,

            // Change effect actions
            changeSelectedEffect: action,
        });

    }

    setInput(input: MIDIInput) {
        this.inputPort = input
        // Add input event listener
        this.setupReceivedSysEx();
    }

    setOutput(output: MIDIOutput) {
        this.outputPort = output 
    }


    // USER METHODS

    // -- PRESET ACTIONS --
    changePreset(preset_number: number) {
        // Clamp to valid range
        const num = Math.min(Math.max(preset_number, 0), 255);

        // Execute action in physical device
        this._midiSendChangePreset(num);

        // Should I update here or in received messages?
    }

    incrementPresetNum() {
      this.current_preset_number++;
      if (this.current_preset_number > 255) {
        this.current_preset_number = 0;
      }

      this.changePreset(this.current_preset_number);
    }

    decrementPresetNum() {
      this.current_preset_number--;
      if (this.current_preset_number < 0) {
        this.current_preset_number = 255;
      }

      this.changePreset(this.current_preset_number);
    }

    // savePreset()

    // -- PATCH/PRESET SETTINGS --
    // changeKnobAssignment() 
    // changeEXPSettings()
    // changeCTRLSettings() 
    // changePresetFXLoop()

    // -- EFFECT CHAIN ACTIONS
    // changePresetChainOrder()
    // changeEffect() // Change the effect for a given effect unit
    // changeParameterEffect() // Change the effect for a given effect unit

    changeEffectState(state: boolean) {
        // should select current preset and current pedal
        this.current_effect.changeState(state);
        console.log("Effect type", this.current_effect.type);
        this._midiChangeEffectState(this.current_effect.type, this.current_effect.state);
    }

    changeSelectedEffect(type: string) {
      switch (type) {
        case 'PRE':
          this.current_effect = this.current_preset.pre;
          break;
        case 'WAH':
          this.current_effect = this.current_preset.wah;
          break;
        case 'DST':
          this.current_effect = this.current_preset.dst;
          break;
        case 'AMP':
          this.current_effect = this.current_preset.amp;
          break;
        case 'NR':
          this.current_effect = this.current_preset.nr;
          break;
        case 'CAB':
          this.current_effect = this.current_preset.cab;
          break;
        case 'EQ':
          this.current_effect = this.current_preset.eq;
          break;
        case 'MOD':
          this.current_effect = this.current_preset.mod;
          break;
        case 'DLY':
          this.current_effect = this.current_preset.dly;
          break;
        case 'RVB':
          this.current_effect = this.current_preset.rvb;
          break;
        case 'VOL':
          this.current_effect = this.current_preset.vol;
          break;
      }
    }

    // INTERNAL METHODS
    sendSysEx(message: Uint8Array | number[]) {
        this.outputPort?.send(message);
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
        this.inputPort?.addEventListener("midimessage", listener);
    }

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


    // encodeSysEx()

    // MIDI METHODS
    _midiSendChangePreset(num: number) {
        let msg = PatchChangeBaseSysEx;
        const high_byte = (num >> 4) & 0x0f;
        const low_byte = (num) & 0x0f;
        msg[25] = high_byte;
        msg[26] = low_byte;

        this.sendSysEx(msg);
    }

    _midiGetChangePreset(message: number[] | Uint8Array) {
        // We already know this is the kind of message
        let baseSysEx = message;
        const high_byte = baseSysEx[25] 
        const low_byte = baseSysEx[26]

        //console.log("bytes ", high_byte, low_byte);

        const num = ((high_byte & 0x0f) << 4) | (low_byte & 0x0f);
        //console.log("read change preset number = ", num);

        this.current_preset_number = num;
    }

    _midiChangeEffectState(pedal_id: number, state: boolean) {
       let baseSysEx = changeEffectState;
       // check range of ids from 0 to 10 inclusive
        baseSysEx[0x16] = pedal_id;
        baseSysEx[0x18] = state ? 1: 0;

        this.sendSysEx(baseSysEx);
    }
    // _midiGetPresets() // execute sequence to start receiving all preset information
    // _


}


export const gp200 = new GP200Model();