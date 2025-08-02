
import { action, computed, makeObservable, observable } from "mobx";
import { EffectModel, EffectType } from "./effect/effect";
import { PresetModel } from "./preset/preset";


export class GP200Model {


    presets: PresetModel[];

    // Currently available for editing
    currentPresetNumber: number | undefined;
    currentPreset: PresetModel | undefined;
    currentEffect: EffectModel | undefined;
    
    syncedPresets: number;
    syncing: boolean;


    constructor() {

        this.presets = []
        // initialize internal values
        this.currentPresetNumber = undefined;
        this.currentPreset = undefined;
        this.currentEffect = undefined;

        this.syncedPresets = 0;
        this.syncing = false;


        makeObservable(this, {
            presets: observable,

            currentPresetNumber: observable,
            currentPreset: observable,
            currentEffect: observable,
            // test
            syncedPresets: observable,
            syncing: observable,

            // Change preset actions
            changePreset: action,
            addPreset: action,

            presetBankCode: computed,
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
        this.currentPresetNumber = num;
        this.currentPreset = this.presets[num];

        // select to pre by default
        this.changeSelectedEffect(0);

        console.log("Current preset",this.currentPreset);
    }

    addPreset(preset: PresetModel) {
      this.presets[preset.number] = preset;
      this.syncedPresets = this.presets.length;
      this.syncing = false;
    }

    get presetBankCode(): string {
      const number = this.currentPresetNumber;

      if (number === undefined) {
          return "";
      }

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
      if (!this.currentPreset) { return }

      this.currentPreset.changeEffectsChainOrder(order);
    }

    changeEffectState(state: boolean) {
        // should select current preset and current pedal
        if (!this.currentEffect) { return }

        this.currentEffect.changeState(state);
        console.log("Effect type", this.currentEffect.type);
    }

    changeParamValue(effectChainID: number, parameterID: number, value: number) {
      if (!this.currentPreset) { return }

      const e = this.currentPreset.effects.filter(e => e.type === effectChainID);
      e[0].setParameterValue(parameterID, value);
    }

    changeSelectedEffect(effectType: EffectType) {
      if (!this.currentPreset) { return }

      this.currentEffect = this.currentPreset.effects[effectType as number];
      console.log("Current effect", this.currentEffect)
    }


    changeEffectByID(effectID: number[], effectType: EffectType) {
        // Get Effect model with given specs
        // Assign effect in current preset
        if (!this.currentPreset) { return }

        const e = EffectModel.defaultfromID(effectID, effectType);
        this.currentPreset.effects[e.type] = e;
        this.currentEffect = e;
    }

}
