import { ICtrlSettings } from "./ICtrlSettings";
import { IExpSettings } from "./IExpSettings";
import { IFxLoopSettings } from "./IFxLoopSettings";
import { IKnobSettings } from "./IKnobSettings";


export interface ISyncEffectInfo {
    chainID: number;
    id: number[];
    state: boolean; //or should it be a number?
    params: number[]; //15 elements not all used
}

export interface ISyncPresetInfo {
    // General info
    name: string;
    number: number;

    // Settings
    volume: number;
    pan: number;
    bpm: number;
    effectsChainOrder: number[];

    // FXLOOP
    fxloop: IFxLoopSettings;

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

    // EXP
    exp1A: [IExpSettings, IExpSettings, IExpSettings];
    exp1B: [IExpSettings, IExpSettings, IExpSettings];
    exp2: [IExpSettings, IExpSettings, IExpSettings];

    // Effects
    effects: ISyncEffectInfo[];
}