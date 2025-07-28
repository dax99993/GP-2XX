

export interface IGPPresetInfo {
    name: string;

    // Settings
    volume: number;
    pan: number;
    bpm: number;

    //fxloop
    fxSendLevel: number;
    fxReturnLevel: number;
    fxSendPosition: number;
    fxReturnPosition: number;
    fxMode: number;

    // CTRL
    // ctrl1: number; //action
    //...
    // ctrl8

    // EXP
    // exp1aAssign1
    // exp1aAssign2
    // exp1aAssign3
    // exp1BAssign1
    // exp1BAssign2
    // exp1BAssign3

    // exp2Assign1
    // exp2Assign2
    // exp2Assign3

    // Effects
    //effects

    // Maybe EXP value

}