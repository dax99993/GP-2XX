import { action, computed, makeObservable, observable } from "mobx";
import { EffectModel, EffectType } from "./effect/effect";
import { PresetModel } from "./preset/preset";

import { eventHandler, SyncEvents } from "@/utils/eventHandler";
import { IPresetInfo } from "./preset/IPresetInfo";

export class GP200Model {
  isJR: boolean;

  //presets: PresetModel[];
  presets: IPresetInfo[];

  irNames: string[];

  // Currently available for editing
  currentPresetNumber: number | undefined;
  currentPreset: PresetModel | undefined;
  currentEffect: EffectModel | undefined;

  // Syncing flags
  syncing: boolean;
  syncingErrorOccur: boolean;
  isSynced: boolean;

  syncedPresets: number;
  syncedIRName: number;

  syncingStoredPresets: boolean;
  syncingCurrentPreset: boolean;
  syncingIRNames: boolean;

  constructor() {
    this.isJR = false;

    // initialize internal values
    this.presets = [];

    this.irNames = [];
    // this.irNames = [
    //   "User IR 1", "User IR 2", "User IR 3", "User IR 4", "User IR 5",
    //   "User IR 6", "User IR 7", "User IR 8", "User IR 9", "User IR 10",
    //   "User IR 11", "User IR 12", "User IR 13", "User IR 14", "User IR 15",
    //   "User IR 16", "User IR 17", "User IR 18", "User IR 19", "User IR 20",
    // ];

    this.currentPresetNumber = undefined;
    this.currentPreset = undefined;
    this.currentEffect = undefined;

    this.syncing = false;
    this.syncingErrorOccur = false;
    this.isSynced = false;

    this.syncedPresets = 0;
    this.syncedIRName = 0;

    this.syncingStoredPresets = false;
    this.syncingCurrentPreset = false;
    this.syncingIRNames = false;

    makeObservable(this, {
      // OBSERVABLES
      presets: observable,
      irNames: observable,

      currentPresetNumber: observable,
      currentPreset: observable,
      currentEffect: observable,

      // Syncing states
      syncing: observable,
      syncingErrorOccur: observable,
      isSynced: observable,

      syncedPresets: observable,
      syncedIRName: observable,

      syncingStoredPresets: observable,
      syncingCurrentPreset: observable,
      syncingIRNames: observable,

      // COMPUTED
      currentPresetBankCode: computed,

      // ACTIONS
      SetToStartSyncing: action,

      StoredPresetSynced: action,
      CurrentPresetSynced: action,
      StoredIRNameSynced: action,

      addIRName: action,
      changeIRName: action,
      deleteIRName: action,

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
    this.presets = [];
    this.irNames = [];

    this.syncedPresets = 0;
    this.syncedIRName = 0;
    this.syncing = false;
    this.syncingErrorOccur = false;
  }

  SyncingDone() {
    this.syncing = false;
  }

  // --------------------- Syncing PRESETS --------------------------------------
  StoredPresetSynced() {
    // Notify
    console.log(
      "----------------------------------------------------------------",
    );
    console.log("Preset Synced", this.presets.length - 1);
    console.log(
      "----------------------------------------------------------------",
    );

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

  get AreStoredPresetsSynced(): boolean {
    if (this.isJR) {
      return this.presets.length == 255;
    } else {
      return this.presets.length == 256;
    }
  }

  // --------------------- Syncing IR names --------------------------------------
  addIRName(name: string, IRNumber: number) {
    // this.irNames.push(name);
    this.irNames[IRNumber] = name;
  }

  get AreStoredIRNamesSynced(): boolean {
    return this.irNames.length == 20;
  }

  StoredIRNameSynced() {
    // Notify
    console.log(
      "----------------------------------------------------------------",
    );
    console.log("IR Name Synced", this.irNames.length - 1);
    console.log(
      "----------------------------------------------------------------",
    );

    // Set flag
    if (this.AreStoredIRNamesSynced) {
      this.syncingIRNames = false;
    }

    console.log("Next IR Name Sync to emit!");
    // eventHandler.emitEvent(SyncEvents.StoredPresetSynced, this.syncedPresets);
    eventHandler.emitEvent(SyncEvents.UserIRNameSynced, this.irNames.length);
  }

  changeIRName(IRNumber: number, IRName: string) {
    this.irNames[IRNumber] = IRName;
  }

  deleteIRName(IRNumber: number) {
    // More than delete is reset to default values
    this.irNames[IRNumber] = "User IR";
  }

  // Getters
  get currentPresetBankNumber(): number | undefined {
    const number = this.currentPresetNumber;

    if (number == undefined) {
      return undefined;
    } else {
      if (this.isJR) {
        return Math.floor(number / 3);
      } else {
        return Math.floor(number / 4);
      }
    }
  }

  get currentPresetBankSlotNumber(): number | undefined {
    const number = this.currentPresetNumber;

    if (number == undefined) {
      return undefined;
    } else {
      if (this.isJR) {
        return number % 3;
      } else {
        return number % 4;
      }
    }
  }

  get currentPresetBankCode(): string {
    const bankNumber = this.currentPresetBankNumber;
    const bankSlotNumber = this.currentPresetBankSlotNumber;

    if (bankNumber === undefined || bankSlotNumber === undefined) {
      return "";
    }

    let bankLetter: string = "";
    switch (bankSlotNumber) {
      case 0:
        bankLetter = "A";
        break;
      case 1:
        bankLetter = "B";
        break;
      case 2:
        bankLetter = "C";
        break;
      case 3:
        bankLetter = "D";
        break;
    }

    return (bankNumber + 1).toString().padStart(2, "0") + "-" + bankLetter;
  }

  // -- PRESET ACTIONS --
  changePreset(preset_number: number) {
    // Clamp to valid range
    // const num = Math.min(Math.max(preset_number, 0), 255);
    const num = Math.min(Math.max(preset_number, 0), this.isJR ? 254 : 255);
    this.currentPresetNumber = num;

    // clone the preset
    this.currentPreset = new PresetModel(this.presets[num]);

    // select to pre by default
    this.changeSelectedEffect(0);

    console.log("Current preset", this.currentPreset);
  }

  LoadPresetTo(presetInfo: IPresetInfo, location: number) {
    this.presets[location] = presetInfo;
    if (location == this.currentPresetNumber) {
      this.currentPreset = new PresetModel(presetInfo);
    }
  }

  saveCurrentPreset(presetNumber: number, presetName: string) {
    if (!this.currentPreset) {
      return;
    }

    console.log(
      "Save current preset",
      this.currentPresetNumber,
      "to location",
      presetNumber,
      "with name",
      presetName,
    );
    this.currentPreset.name = presetName;
    this.currentPreset.number = presetNumber;

    this.presets[presetNumber] = this.currentPreset.toPresetInfo();
  }

  // -- PATCH/PRESET SETTINGS --
  changePresetFxLoopPosition(sendPosition: number, returnPosition: number) {
    // check fxloop positions
    if (!this.currentPreset) {
      return;
    }

    this.currentPreset.changeFxLoopPosition(sendPosition, returnPosition);
  }

  // -- EFFECT CHAIN ACTIONS
  changePresetChainOrder(order: number[]) {
    // check order has 11 elements in range(0-10)
    if (!this.currentPreset) {
      return;
    }

    this.currentPreset.changeEffectsChainOrder(order);
  }

  changeEffectState(state: boolean) {
    // should select current preset and current pedal
    if (!this.currentEffect) {
      return;
    }

    this.currentEffect.changeState(state);
    console.log("Effect type", this.currentEffect.type);
  }

  changeParamValue(effectChainID: number, parameterID: number, value: number) {
    if (!this.currentPreset) {
      return;
    }

    const e = this.currentPreset.effects.filter(
      (e) => e.type === effectChainID,
    );
    console.log("Set param value", parameterID, value);
    e[0].setParameterValue(parameterID, value);
  }

  changeSelectedEffect(effectType: EffectType) {
    if (!this.currentPreset) {
      return;
    }

    this.currentEffect = this.currentPreset.effects[effectType as number];
    console.log("Current effect", this.currentEffect);
  }

  changeEffectByID(effectID: number, effectType: EffectType) {
    // Get Effect model with given specs
    // Assign effect in current preset
    if (!this.currentPreset) {
      return;
    }

    const e = EffectModel.defaultFromID(effectID, effectType);
    this.currentPreset.effects[e.type] = e;
    this.currentEffect = e;
  }
}
