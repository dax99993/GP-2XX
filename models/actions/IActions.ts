
export interface IActions {
    // PRESET ACTIONS
    ChangePreset(presetNumber: number): void;

    ChangePresetChainOrder(effectsChainOrder: number[]): void;
    // PRESET SETTINGS ACITONS

    // EFFECT ACTIONS
    //ChangeEffect();
    ChangeEffectState(state: boolean): void;
    ChangeEffectParamValue(paramId: number, paramNumericType: string, n:number): void;
}

export interface IDeviceActions {
    // PRESET ACTIONS
    ChangePreset(message: number[]): void;

    ChangePresetChainOrder(message: number[]): void;
    // PRESET SETTINGS ACITONS

    // EFFECT ACTIONS
    ChangeEffectState(message: number[]): void;
    ChangeEffectParamValue(message: number[]): void;
}