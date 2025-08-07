
export enum KnobModule {
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
    PATCHVOL = 11,
    BPM = 12,
    OFF = 255,
}

export interface IKnobSettings {
    number: number; // Number of the knob in range [0, 2]
    module: KnobModule; //Module knob is assign to.
    paramID: number; //this number is ignore when module is patchvol, bpm or OFF
}