import { makeAutoObservable } from "mobx";
import { EffectModel } from "../effect/effect";
import { IExpAssign, IFxLoop, ISyncPresetInfo } from "./ISyncPresetInfo";

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
    fxLoop: IFxLoop;
    // EXP
    exp1AParam1: IExpAssign;
    // CTRL 

    // KNOBS


    // EFFECTS
    effects: EffectModel[];

    // METHODS
    constructor(presetInfo: ISyncPresetInfo) {
        
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
        this.exp1AParam1 = presetInfo.exp1AParam1;
        // CTRL
        // KNOB

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