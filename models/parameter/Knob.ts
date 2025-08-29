import { makeAutoObservable } from "mobx";
import { IKnob } from "./IKnob";
import { IParameter, ParamType } from "./IParameter";


export class Knob implements IParameter, IKnob {
    name: string;
    index: number;
    ID: number;
    default: number;
    min: number;
    max: number;
    step: number;
    type: ParamType;
    suffix: string;
    minIsOff: boolean;
    valueType: number | null;
    bind: number | null;

    currentValue: number;

    constructor(iknob: IKnob) {
        this.name = iknob.name;
        this.index = iknob.index;
        this.ID = iknob.ID;
        this.default= iknob.default;
        this.min = iknob.min;
        this.max= iknob.max;
        this.step = iknob.step;
        this.type = iknob.type;
        this.suffix = iknob.suffix;
        this.minIsOff = iknob.minIsOff;
        this.valueType = iknob.valueType;
        this.bind = iknob.bind;
        
        // Initialize to default value
        this.currentValue = this.default;

        makeAutoObservable(this);
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
        return `${this.currentValue} ${this.suffix}`;
    }

    getValueAsString(num: number): string {
        const n = this.clampValue(num);

        if ((n == this.min && this.minIsOff) || (n == this.max && this.minIsOff && this.valueType == 2)) {
            return "OFF";
        } else {
            return `${n} ${this.suffix}`;
        }
    }
    
    getName(): string {
        return this.name;
    }

    clampValue(value: number): number {
        return Math.max(this.min, Math.min(value, this.max));
    }

    getCurrentStep(): number {
        return this.step
    }

    getMinValue(): number {
        return this.min;
    }

    getMinStringValue(): string {
        if (this.minIsOff) {
            return "OFF";
        } else {
            return this.min.toString();
        }
    }

    getMaxValue(): number {
        return this.max;
    }

    getMaxStringValue(): string {
        if (this.minIsOff && this.valueType == 2) {
            return "OFF";
        } else {
            return this.max.toString();
        }
    }
}