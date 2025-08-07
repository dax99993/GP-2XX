
export enum FxLoopMode {
    Parallel = 0,
    Series = 1,
}

export interface IFxLoopSettings {
    sendLevel: number; // in range 0-100
    returnLevel: number; // in range 0-100
    sendPosition: number; // in range 0-10
    returnPosition: number; // in range 0-10; <= to sendPosition
    mode: FxLoopMode;
}