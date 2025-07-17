
import { action, makeObservable, observable } from "mobx";
import { EffectModel } from "./effect/effect";
import { MidiGPDeviceModel } from "./gpMidiDevice";
import { DoubleParameterModel } from "./parameter/doubleParameter";
import { default_preset, PresetModel } from "./preset";


export class GP200Model {

    //presets: Preset[];
    current_preset: PresetModel;
    current_preset_number: number;

    current_effect: EffectModel;

    // Internal props
    midi: MidiGPDeviceModel; 
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

    addMidi(m: MidiGPDeviceModel) {
      this.midi = m;
    }

    // USER METHODS

    // -- PRESET ACTIONS --
    changePreset(preset_number: number) {
        // Clamp to valid range
        const num = Math.min(Math.max(preset_number, 0), 255);
        this.current_preset_number = num;

        // Execute action in physical device
        this.midi._midiSendChangePreset(num);

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

    getPresetBankCode(): string {
      const number = this.current_preset_number;
      const bankNumber = Math.floor(number / 4) + 1;
      let bankLetter: string = "";
      switch (number % 4) {
        case 0:
          bankLetter = 'A';
          break;
        case 1:
          bankLetter = 'B';
          break;
        case 2:
          bankLetter = 'C';
          break;
        case 3:
          bankLetter = 'D';
          break;
      }

      return bankNumber + '-' + bankLetter;
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

        this.midi._midiChangeEffectState(this.current_effect.type, this.current_effect.state);
    }

    changeParamValue(name: string, value: number) {
      const p = this.current_effect.parameters.filter(p => p.name === name);
      //console.log("Modifying ", p[0].name);
      p[0].setValue(value);

      // check for double parameters
      const other_param_name = p[0].changes_param;
      //console.log("change parameter = ", other_param_name);
      if (other_param_name != "") {
        const q = this.current_effect.parameters.filter(p => p.name == other_param_name);
        if (q[0].type == "Double") {
          const w = q[0] as DoubleParameterModel;
          w.activeSecondRange(value != 0);
        }
      }
      // midi action

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
      console.log("Current effect: ", this.current_effect);
      console.log("Current params: ", this.current_effect.parameters);
    }



    // encodeSysEx()

    // _midiGetPresets() // execute sequence to start receiving all preset information
    // _


}


//export const gp200 = new GP200Model();