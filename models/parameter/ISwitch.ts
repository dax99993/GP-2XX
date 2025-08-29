import { IMenu } from "./IMenu";
import { ParamType } from "./IParameter";

export interface ISwitch {
    name: string;
    index: number,
    ID: number,

    default: number;
    // Fixed in 3
    type: ParamType;
    // Fixed in Power
    //_SubType: string;
    // What value it is being bind to
    bind: number | null;
    data: IMenu[];
}