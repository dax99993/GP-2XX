import { ICombox } from "./ICombox";
import { IMenu } from "./IMenu";
import { IParameter, ParamType } from "./IParameter";


export class Combox implements ICombox, IParameter {
    name: string;
    index: number;
    ID: number;
    default: number;
    type: ParamType;
    data: IMenu[];

    currentValue: number;
    min: number;
    max: number;
    step: number;

    constructor(icombox: ICombox) {
        this.name = icombox.name;
        this.index = icombox.index;
        this.ID = icombox.ID;
        this.default= icombox.default;
        // this.min = iswitch.min;
        // this.max= iswitch.max;
        // this.step = iswitch.step;
        this.type = icombox.type;
        this.data = icombox.data;
        
        // Initialize to default value
        this.currentValue = this.default;
        this.min = 0 // All start with 0
        this.max = this.data.length - 1; //All Menu entries have consecutive ids, so just the length 
        this.step = 1;
    }

    setValue(value: number): number {
        const v = this.clampValue(value);
        this.currentValue = v;

        return v;
    }

    getValue(): number {
        return this.currentValue;
    }

    getCurrentValueAsString(): string {
        return this.data[this.currentValue].name;
    }

    getValueAsString(num: number): string {
        const n = this.clampValue(num);

        return this.data[n].name;
    }

    getName(): string {
        return this.name;
    }

    clampValue(value: number): number {
        return Math.max(this.min, Math.min(value, this.max));
    }

    getCurrentStep(): number {
        return this.step;
    }

    getMinValue(): number {
        return this.min;
    }

    getMinStringValue(): string {
        return this.data[0].name;
    }

    getMaxValue(): number {
        return this.max;
    }

    getMaxStringValue(): string {
        return this.data[this.data.length - 1].name;
    }

}