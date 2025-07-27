
import { action, computed, makeObservable, observable } from "mobx";
import { EffectModel, EffectType } from "./effect/effect";
import { DoubleParameterModel } from "./parameter/doubleParameter";
import { default_preset, PresetModel } from "./preset/preset";


export class GP200Model {

    //presets: Preset[];
    current_preset: PresetModel;
    current_preset_number: number;

    current_effect: EffectModel;


    constructor() {

        // initialize internal values
        this.current_preset_number = 0;

        // Just to test
        this.current_preset = default_preset;
        //console.log(JSON.stringify(default_preset));
        this.current_effect = default_preset.effects[0];

        makeObservable(this, {
            current_preset_number: observable,
            current_effect: observable,
            // Change preset actions

            presetBankCode: computed,
            changePreset: action,
            //changeEffect: action,
            changeEffectByID: action,
            
            // Change effect actions
            changeSelectedEffect: action,
        });

    }

    // USER METHODS

    // -- PRESET ACTIONS --
    changePreset(preset_number: number) {
        // Clamp to valid range
        const num = Math.min(Math.max(preset_number, 0), 255);
        this.current_preset_number = num;

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
    changePresetChainOrder(order: number[]) {
      // check order has 11 elements in range(0-10)
      this.current_preset.chainOrder = order;
    }
    // changeEffect() // Change the effect for a given effect unit
    // changeParameterEffect() // Change the effect for a given effect unit

    changeEffectState(state: boolean) {
        // should select current preset and current pedal
        this.current_effect.changeState(state);
        console.log("Effect type", this.current_effect.type);
    }

    changeParamValue(effectID: number, parameterID: number, value: number) {
      //const p = this.current_effect.parameters.filter(p => p.name === name && p.id === parameterID);
      const e = this.current_preset.effects.filter(e => e.type === effectID);
      const p = e[0].parameters.filter(p => p.id === parameterID);
      //console.log("Modifying ", p[0].name);
      p[0].setValue(value);

      // check for double parameters
      const other_param_name = p[0].changes_param;
      //console.log("change parameter = ", other_param_name);
      if (other_param_name != "") {
        const q = this.current_effect.parameters.filter(p => p.name === other_param_name);
        if (q[0].type === "Double") {
          const w = q[0] as DoubleParameterModel;
          w.activeSecondRange(value != 0);
        }
      }
    }

    changeSelectedEffect(effectType: EffectType) {
      this.current_effect = this.current_preset.effects[effectType as number];
    }

    // changeEffect(effectName: string, effectType: EffectType) {
    //     // Get Effect model with given specs
    //     // Assign effect in current preset
    //     const e = EffectModel.fromName(effectName, effectType);
    //     this.current_preset.effects[effectType] = e;
    //     this.current_effect = e;
    // }

    changeEffectByID(effectID: number[], effectType: EffectType) {
        // Get Effect model with given specs
        // Assign effect in current preset
        const e = EffectModel.fromID(effectID, effectType);
        this.current_preset.effects[e.type] = e;
        this.current_effect = e;
    }



    // encodeSysEx()

    // _midiGetPresets() // execute sequence to start receiving all preset information
    // _


}


//export const gp200 = new GP200Model();