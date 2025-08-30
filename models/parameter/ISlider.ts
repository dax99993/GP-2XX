import { ParamType } from "./IParameter";

export interface ISlider {
    name: string;
    index: number;
    ID: number;

    default: number;
    min: number,
    max: number,
    step: number,

    // Fixed in 1
    type: ParamType,
}