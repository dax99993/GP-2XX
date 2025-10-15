
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
    
    // Syncing flags
    syncing: boolean;
    syncingErrorOccur: boolean;
    isSynced: boolean;

    syncedPresets: number;

    syncingStoredPresets: boolean;
    syncingCurrentPreset: boolean;


    constructor() {
      // initialize internal values
      this.presets = []

      this.currentPresetNumber = undefined;
      this.currentPreset = undefined;
      this.currentEffect = undefined;

      this.syncing = false;
      this.syncingErrorOccur = false;
      this.isSynced = false;

      this.syncedPresets = 0;

      this.syncingStoredPresets = false;
      this.syncingCurrentPreset = false;

      makeObservable(this, {
        // OBSERVABLES
        presets: observable,

        currentPresetNumber: observable,
        currentPreset: observable,
        currentEffect: observable,

        // Syncing states
        syncing: observable,
        syncingErrorOccur: observable,
        isSynced: observable,

        syncedPresets: observable,

        syncingStoredPresets: observable,
        syncingCurrentPreset: observable,

        // COMPUTED
        presetBankCode: computed,

        // ACTIONS
        SetToStartSyncing: action,

        StoredPresetSynced: action,
        CurrentPresetSynced: action,

        // Change preset actions
        changePreset: action,
        addPreset: action,
        LoadPresetTo: action,
        saveCurrentPreset: action,

        //changeEffect: action,
        changeEffectByID: action,

        // Change effect actions
        changeSelectedEffect: action,

      });

    }

    // SYNCING METHODS
    SetToStartSyncing() {
      this.presets = []
      this.syncedPresets = 0
      this.syncing = false; 
      this.syncingErrorOccur = false;
    }

    SyncingDone() {
      this.syncing = false;
    }

    StoredPresetSynced() {
      // Notify
      console.log("----------------------------------------------------------------");
      console.log("Preset Synced", this.presets.length - 1);
      console.log("----------------------------------------------------------------");

      // this.syncedPresets = this.presets.length;

      // Set flag
      if (this.AreStoredPresetsSynced) {
        this.syncingStoredPresets = false;
      }

      console.log("Next Stored Preset Sync to emit!");
      // eventHandler.emitEvent(SyncEvents.StoredPresetSynced, this.syncedPresets);
      eventHandler.emitEvent(SyncEvents.StoredPresetSynced, this.presets.length);
    }

    CurrentPresetSynced() {
      // Set flag
      this.syncingCurrentPreset = false;
      eventHandler.emitEvent(SyncEvents.CurrentPresetSynced);
    }

    addPreset(preset: IPresetInfo) {
      this.presets[preset.number] = preset;
    }

    addCurrentPreset(preset: IPresetInfo) {
      this.currentPresetNumber = preset.number;
      this.currentPreset = new PresetModel(preset);

      // select to pre by default
      this.changeSelectedEffect(0);
    }

    // get isSynced(): boolean {
    //   // Add all other synced
    //   // return this.StorePresetsSynced;
    //   return false;
    // }

    get AreStoredPresetsSynced(): boolean {
      return this.presets.length == 256;
      // return this.presets.length == 50;
      // return this.presets.length == 16;
    }

    get currentPresetBankNumber(): number | undefined {
      const number = this.currentPresetNumber;

      if (number == undefined) {
        return undefined;
      } else {
        return Math.floor(number / 4);
      }
    }

    get currentPresetBankSlotNumber(): number | undefined {
      const number = this.currentPresetNumber;

      if (number == undefined) {
        return undefined;
      } else {
        return number % 4;
      }
    }

    get presetBankCode(): string {
      const bankNumber = this.currentPresetBankNumber;
      const bankSlotNumber = this.currentPresetBankSlotNumber;

      if (bankNumber === undefined || bankSlotNumber === undefined) {
          return "";
      }

      let bankLetter: string = "";
      switch (bankSlotNumber) {
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

      return (bankNumber + 1).toString().padStart(2, '0') + '-' + bankLetter;
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

    LoadPresetTo(presetInfo :IPresetInfo, location: number) {
        this.presets[location] = presetInfo;
        if (location == this.currentPresetNumber) {
            this.currentPreset = new PresetModel(presetInfo);
        }
    }

    saveCurrentPreset(presetNumber: number, presetName: string) {
        if (!this.currentPreset) { return }

        console.log("Save current preset", this.currentPresetNumber, "to location", presetNumber, "with name", presetName);
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
