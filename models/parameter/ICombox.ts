import { IMenu } from "./IMenu";
import { ParamType } from "./IParameter";

export interface ICombox {
    name: string;
    index: number;
    ID: number;

    default: number;
    // Fixed in 2
    type: ParamType;
    data: IMenu[];
}