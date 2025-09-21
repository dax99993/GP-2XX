
import { action, computed, makeObservable, observable } from "mobx";
import { EffectModel, EffectType } from "./effect/effect";
import { PresetModel } from "./preset/preset";

import { eventHandler, SyncEvents } from "@/utils/eventHandler";
import { IPresetInfo } from "./preset/IPresetInfo";

export class GP200Model {

    //presets: PresetModel[];
    presets: IPresetInfo[];

    // Currently available for editing
    currentPresetNumber: number | undefined;
    currentPreset: PresetModel | undefined;
    currentEffect: EffectModel | undefined;
    
    syncedPresets: number;
    syncing: boolean;
    syncingErrorOccur: boolean;


    constructor() {
      // Add all syncing events
        // eventHandler.addEventListener('syncPreset', (presetNumber: number) => this.SyncPreset(presetNumber))

        // initialize internal values
        this.presets = []

        this.currentPresetNumber = undefined;
        this.currentPreset = undefined;
        this.currentEffect = undefined;

        this.syncedPresets = 0;
        this.syncing = false;
        this.syncingErrorOccur = false;


        makeObservable(this, {
            presets: observable,

            currentPresetNumber: observable,
            currentPreset: observable,
            currentEffect: observable,

            // test
            syncedPresets: observable,
            syncing: observable,
            syncingErrorOccur: observable,
            
            SetToStartSyncing: action,
            SyncingPresetDone: action,

            // Change preset actions
            changePreset: action,
            addPreset: action,
            LoadPresetTo: action,

            presetBankCode: computed,
            //changeEffect: action,
            changeEffectByID: action,
            
            // Change effect actions
            changeSelectedEffect: action,
        });

    }

    // USER METHODS
    SetToStartSyncing() {
      this.presets = []
      this.syncedPresets = 0
      this.syncing = false; 
      this.syncingErrorOccur = false;
    }

    SyncingPresetDone() {
      this.syncedPresets = this.presets.length;
      this.syncing = false;

      // Notify
      console.log("----------------------------------------------------------------");
      console.log("Preset Synced", this.syncedPresets - 1);
      console.log("----------------------------------------------------------------");

      // eventHandler.emitEvent(SyncEvents.PresetSynced, this.syncedPresets);
      console.log("Sync event emitted!");
      eventHandler.emitEvent(SyncEvents.PresetSynced, this.syncedPresets);
      // eventHandler.emitEvent(SyncEvents.PresetSynced, {presetNumber: this.syncedPresets});
    }

    addPreset(preset: IPresetInfo) {
      this.presets[preset.number] = preset;
    }

    LoadPresetTo(presetInfo :IPresetInfo, location: number) {
        this.presets[location] = presetInfo;
        if (location == this.currentPresetNumber) {
            this.currentPreset = new PresetModel(presetInfo);
        }
    }

    get isSynced(): boolean {
      // return this.syncedPresets == 256;
      // return this.syncedPresets == 50;
      return this.syncedPresets == 16;
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

      return bankNumber.toString().padStart(2, '0') + '-' + bankLetter;
    }

    // -- PRESET ACTIONS --
    changePreset(preset_number: number) {
        // Clamp to valid range
        const num = Math.min(Math.max(preset_number, 0), 255);
        this.currentPresetNumber = num;

        // clone the preset
        this.currentPreset = new PresetModel(this.presets[num]);

        // select to pre by default
        this.changeSelectedEffect(0);

        console.log("Current preset",this.currentPreset);
    }

    savePreset(presetNumber: number, presetName: string) {
        if (!this.currentPreset) { return }

        this.currentPreset.name = presetName;
        this.currentPreset.number = presetNumber;

        this.presets[presetNumber] = this.currentPreset.toPresetInfo();
    }



    // -- PATCH/PRESET SETTINGS --
    changePresetFxLoopPosition(sendPosition: number, returnPosition: number) {
      // check fxloop positions
      if (!this.currentPreset) { return }

      this.currentPreset.changeFxLoopPosition(sendPosition, returnPosition);
    }


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
      console.log("Set param value", parameterID, value);
      e[0].setParameterValue(parameterID, value);
    }

    changeSelectedEffect(effectType: EffectType) {
      if (!this.currentPreset) { return }

      this.currentEffect = this.currentPreset.effects[effectType as number];
      console.log("Current effect", this.currentEffect)
    }


    changeEffectByID(effectID: number, effectType: EffectType) {
        // Get Effect model with given specs
        // Assign effect in current preset
        if (!this.currentPreset) { return }

        const e = EffectModel.defaultFromID(effectID, effectType);
        this.currentPreset.effects[e.type] = e;
        this.currentEffect = e;
    }

}
