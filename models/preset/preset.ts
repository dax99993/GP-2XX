import { makeAutoObservable } from "mobx";
import { EffectModel } from "../effect/effect";
import { ICtrlSettings } from "./ICtrlSettings";
import { IExpSettings } from "./IExpSettings";
import { IFxLoopSettings } from "./IFxLoopSettings";
import { IKnobSettings } from "./IKnobSettings";
import { ISyncPresetInfo } from "./ISyncPresetInfo";

// type FxLoop = {
//     // 0-11
//     sendPosition: number;
//     // 0-11
//     returnPosition: number;
//     // 0-100
//     sendLevel: number;
//     // 0-100
//     returnLevel: number;
//     // 0 -> parallel ; 1 -> series
//     mode: number;
// }

export class PresetModel {
    // General info
    name: string;
    number: number;

    // category
    // author
    // description

    // Settings
    volume: number;
    pan: number;
    bpm: number;
    effectsChainOrder: number[];

    // FXLOOP
    fxLoop: IFxLoopSettings;

    // EXP
    exp1A: [IExpSettings, IExpSettings, IExpSettings];
    exp1B: [IExpSettings, IExpSettings, IExpSettings];
    exp2: [IExpSettings, IExpSettings, IExpSettings];

    // KNOB
    knob1: IKnobSettings;
    knob2: IKnobSettings;
    knob3: IKnobSettings;

    // CTRL
    ctrl1: ICtrlSettings;
    ctrl2: ICtrlSettings;
    ctrl3: ICtrlSettings;
    ctrl4: ICtrlSettings;

    ctrl5: ICtrlSettings;
    ctrl6: ICtrlSettings;
    ctrl7: ICtrlSettings;
    ctrl8: ICtrlSettings;

    // EFFECTS
    effects: EffectModel[];

    // METHODS
    constructor(presetInfo: ISyncPresetInfo) {
        // General info
        this.name = presetInfo.name;
        this.number = presetInfo.number;

        // Settings
        this.volume = presetInfo.volume;
        this.bpm = presetInfo.bpm;
        this.pan = presetInfo.pan;
        this.effectsChainOrder = presetInfo.effectsChainOrder;

        // FXLOOP
        this.fxLoop = presetInfo.fxloop;

        // EXP
        this.exp1A = presetInfo.exp1A;
        this.exp1B = presetInfo.exp1B;
        this.exp2 = presetInfo.exp2;

        // KNOB
        this.knob1 = presetInfo.knob1;
        this.knob2 = presetInfo.knob2;
        this.knob3 = presetInfo.knob3;

        // CTRL
        this.ctrl1 = presetInfo.ctrl1;
        this.ctrl2 = presetInfo.ctrl2;
        this.ctrl3 = presetInfo.ctrl3;
        this.ctrl4 = presetInfo.ctrl4;

        this.ctrl5 = presetInfo.ctrl5;
        this.ctrl6 = presetInfo.ctrl6;
        this.ctrl7 = presetInfo.ctrl7;
        this.ctrl8 = presetInfo.ctrl8;


        // Create Effect object class from string name
        this.effects = presetInfo.effects.map((effectInfo) => EffectModel.fromEffectInfo(effectInfo));


        // // MOBX
        makeAutoObservable(this);
        // makeObservable(this, {
        //     name: observable,
        //     number: observable,
        //     effectsChainOrder: observable,

        //     // Settings
        //     effects: observable,
        //     //decrementPresetNum: action,


        // });

    }
    // savePreset(save_number, name)

    changeEffectsChainOrder(order: number[]) {
        this.effectsChainOrder = order
    }

}


// default Gp200 preset
// export const default_preset = new PresetModel(2, "Default",
//     "Boost", "P-Wah", "Green OD",
//     "Mess4 LD 3", "Auto Swell", "Mess",
//     "Mess EQ", "M-Chorus", "Vintage Rack",
//     "Plate", "Volume"
//     );