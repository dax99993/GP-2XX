
import { action, computed, makeObservable, observable } from "mobx";
import { EffectModel, EffectType } from "./effect/effect";
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
        this.current_effect = default_preset.effects[0];

        makeObservable(this, {
            current_preset_number: observable,
            current_effect: observable,
            // Change preset actions
            incrementPresetNum: action,
            decrementPresetNum: action,
            presetBankCode: computed,
            changePreset: action,
            changeEffect: action,
            

            // Change effect actions
            changeSelectedEffect: action,
        });

    }

    addMidi(m: MidiGPDeviceModel) {
      this.midi = m;
    }

    // USER METHODS

    // -- PRESET ACTIONS --
    changePreset(preset_number: number, send: boolean = true) {
        // Clamp to valid range
        const num = Math.min(Math.max(preset_number, 0), 255);
        this.current_preset_number = num;

        // Execute action in physical device
        if (send) {
          this.midi._midiSendChangePreset(num);
        }

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

    get presetBankCode(): string {
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
    changePresetChainOrder(order: number[], sendCommand = true) {
      // check order has 11 elements in range(0-10)
      this.current_preset.chainOrder = order;

      if (sendCommand) {
        this.midi._midiSendChangeChainOrder(this.current_preset_number,
          this.current_preset.fxLoop.sendPosition, this.current_preset.fxLoop.returnPosition,
        order)
      }
    }
    // changeEffect() // Change the effect for a given effect unit
    // changeParameterEffect() // Change the effect for a given effect unit

    changeEffectState(state: boolean) {
        // should select current preset and current pedal
        this.current_effect.changeState(state);
        console.log("Effect type", this.current_effect.type);

        this.midi._midiChangeEffectState(this.current_effect.type, this.current_effect.state);
    }

    changeParamValue(effectID: number, parameterID: number, value: number, send: boolean = true) {
      //const p = this.current_effect.parameters.filter(p => p.name === name && p.id === parameterID);
      const e = this.current_preset.effects.filter(e => e.type === effectID);
      const p = e[0].parameters.filter(p => p.id === parameterID);
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
      if (send) {
        this.midi._midiSendChangeEffectParam(this.current_effect.type, p[0].id, p[0].numeric_type[0], value);
      }
    }

    changeSelectedEffect(effectType: EffectType) {
      this.current_effect = this.current_preset.effects[effectType as number];
    }

    changeEffect(name: string, effectType: EffectType) {
        // Get Effect model with given specs
        // Assign effect in current preset
        const e = EffectModel.from(name, effectType);
        this.current_preset.effects[effectType] = e;
        this.current_effect = e;
        // send midi action to update physical device
    }




    // encodeSysEx()

    // _midiGetPresets() // execute sequence to start receiving all preset information
    // _


}


//export const gp200 = new GP200Model();