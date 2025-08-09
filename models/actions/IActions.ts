
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

    ChangePresetChainOrder(message: Uint8Array): void;
    // PRESET SETTINGS ACITONS

    // EFFECT ACTIONS
    ChangeEffect(message: Uint8Array): void;
    ChangeEffectState(message: Uint8Array): void;
    ChangeEffectParamValue(message: Uint8Array): void;
}