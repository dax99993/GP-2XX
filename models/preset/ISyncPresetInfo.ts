
export interface IExpAssign {
    id: number;
    paramNumber: number;
    module: number;
    moduleParamID: number;
    moduleParamNumberMin: number;
    moduleParamNumberMax: number;
}

export interface ICtrlAssign {
    number: number;
    mode: number;
    pedalsAssign: number[];
}

export interface IKnobAssign {
    number: number;
    module: number;
    paramID: number;
}

export interface IFxLoop {
    sendLevel: number;
    returnLevel: number;
    sendPosition: number;
    returnPosition: number;
    mode: number;
    //mode: 0 | 1;
}

export interface ISyncEffectInfo {
    chainID: number;
    id: number[];
    state: boolean; //or should it be a number?
    params: number[]; //15 elements not all used
}

export interface ISyncPresetInfo {
    name: string;
    number: number;

    // Settings
    volume: number;
    pan: number;
    bpm: number;
    effectsChainOrder: number[];

    // FXLOOP
    fxloop: IFxLoop;

    // KNOB
    knob1: IKnobAssign;
    knob2: IKnobAssign;
    knob3: IKnobAssign;

    // CTRL
    ctrl1: ICtrlAssign
    ctrl2: ICtrlAssign
    ctrl3: ICtrlAssign
    ctrl4: ICtrlAssign

    ctrl5: ICtrlAssign
    ctrl6: ICtrlAssign
    ctrl7: ICtrlAssign
    ctrl8: ICtrlAssign

    // EXP
    exp1AParam1: IExpAssign;
    exp1AParam2: IExpAssign;
    exp1AParam3: IExpAssign;

    exp1BParam1: IExpAssign;
    exp1BParam2: IExpAssign;
    exp1BParam3: IExpAssign;

    exp2Param1: IExpAssign;
    exp2Param2: IExpAssign;
    exp2Param3: IExpAssign;

    // Effects
    effects: ISyncEffectInfo[];
}