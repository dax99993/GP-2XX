
export interface IGPExpAssign {
    id: number;
    paramNumber: number;
    module: number;
    moduleParamID: number;
    moduleParamNumberMin: number;
    moduleParamNumberMax: number;
}

export interface IGPCtrlAssign {
    number: number;
    mode: number;
    pedalsAssign: number[];
}

export interface IGPKnobAssign {
    number: number;
    module: number;
    paramID: number;
}

export interface IGPFxLoop {
    sendLevel: number;
    returnLevel: number;
    sendPosition: number;
    returnPosition: number;
    mode: number;
}

export interface IGPEffectInfo {
    chainID: number;
    id: number[];
    state: boolean; //or should it be a number?
    params: number[]; //15 elements not all used
}

export interface IGPPresetInfo {
    name: string;
    number: number;

    // Settings
    volume: number;
    pan: number;
    bpm: number;
    effectsChainOrder: number[];

    // FXLOOP
    fxloop: IGPFxLoop;

    // KNOB
    knob1: IGPKnobAssign;
    knob2: IGPKnobAssign;
    knob3: IGPKnobAssign;

    // CTRL
    ctrl1: IGPCtrlAssign
    ctrl2: IGPCtrlAssign
    ctrl3: IGPCtrlAssign
    ctrl4: IGPCtrlAssign

    ctrl5: IGPCtrlAssign
    ctrl6: IGPCtrlAssign
    ctrl7: IGPCtrlAssign
    ctrl8: IGPCtrlAssign

    // EXP
    exp1AParam1: IGPExpAssign;
    exp1AParam2: IGPExpAssign;
    exp1AParam3: IGPExpAssign;

    exp1BParam1: IGPExpAssign;
    exp1BParam2: IGPExpAssign;
    exp1BParam3: IGPExpAssign;

    exp2Param1: IGPExpAssign;
    exp2Param2: IGPExpAssign;
    exp2Param3: IGPExpAssign;

    // Effects
    effects: IGPEffectInfo[];
}