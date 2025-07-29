
interface ExpAssign {
    id: number;
    paramNumber: number;
    module: number;
    moduleParamNumber: number;
    moduleParamNumberMin: number;
    moduleParamNumberMax: number;
}

interface CtrlAssign {
    number: number;
    mode: number;
    pedalsAssign: number[];
}

interface KnobAssign {
    number: number;
    module: number;
    paramID: number;
}

interface FxLoop {
    fxSendLevel: number;
    fxReturnLevel: number;
    fxSendPosition: number;
    fxReturnPosition: number;
    fxMode: number;
}

interface EffectInfo {
    chainID: number;
    id: number[];
    state: boolean; //or should it be a number?
    params: number[]; //15 elements not all used
}

export interface IGPPresetInfo {
    name: string;

    // Settings
    volume: number;
    pan: number;
    bpm: number;

    // FXLOOP
    fxloop: FxLoop;

    // KNOB
    knob1: KnobAssign;
    knob2: KnobAssign;
    knob3: KnobAssign;

    // CTRL
    ctrl1: CtrlAssign
    ctrl2: CtrlAssign
    ctrl3: CtrlAssign
    ctrl4: CtrlAssign

    ctrl5: CtrlAssign
    ctrl6: CtrlAssign
    ctrl7: CtrlAssign
    ctrl8: CtrlAssign

    // EXP
    exp1AParam1: ExpAssign;
    exp1AParam2: ExpAssign;
    exp1AParam3: ExpAssign;

    exp1BParam1: ExpAssign;
    exp1BParam2: ExpAssign;
    exp1BParam3: ExpAssign;

    exp2Param1: ExpAssign;
    exp2Param2: ExpAssign;
    exp2Param3: ExpAssign;

    // Effects
    effects: EffectInfo;

}