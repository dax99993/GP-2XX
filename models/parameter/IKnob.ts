import { ParamType } from "./IParameter";

export interface IKnob {
    name: string;
    // Position in parameter list
    index: number;
    // ID of parameter in GP
    ID: number;

    default: number;
    min: number;
    max: number;
    step: number;

    // Fixed in 1
    type: ParamType;

    suffix: string;
    minIsOff: boolean;
    // 1 or 2 Differentiate among 
    valueType: number | null;
    bind: number | null;
}