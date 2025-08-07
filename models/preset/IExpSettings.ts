
export enum ExpModule {
    PRE = 0,
    WAH = 1,
    DST = 2,
    AMP = 3,
    NR  = 4,
    CAB = 5,
    EQ = 6,
    MOD = 7,
    DLY = 8,
    RVB = 9,
    VOL = 10,
    OFF = 255,
}

export interface IExpSettings {
    id: number; // Exp id number in range [0, 2] EXP1A, EXP1B, EXP1C
    paramNumber: number; //each exp pedal can be assign to change 3 different parameters
    module: ExpModule; // Module assign to change
    moduleParamID: number; // ID of the param in the module
    moduleParamNumberMin: number; // min number to map when pedal is lifted
    moduleParamNumberMax: number; // max number to map when pedal is pressed
}