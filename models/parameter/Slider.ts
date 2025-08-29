import { makeAutoObservable } from "mobx";
import { IParameter, ParamType } from "./IParameter";
import { ISlider } from "./ISlider";


export class Slider implements ISlider, IParameter {
    name: string;
    index: number;
    ID: number;
    default: number;
    min: number;
    max: number;
    step: number;
    type: ParamType;
    suffix: string;

    currentValue: number;

    constructor(islider: ISlider) {
        this.name = islider.name;
        this.index = islider.index;
        this.ID = islider.ID;
        this.default= islider.default;
        this.min = islider.min;
        this.max= islider.max;
        this.step = islider.step;
        this.type = islider.type;
        this.suffix = islider.suffix;
        
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
        return `${this.currentValue}`;
    }

    getValueAsString(num: number): string {
        const n = this.clampValue(num);

        return n.toString();
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
        return `${this.min} ${this.suffix}`;
    }

    getMaxValue(): number {
        return this.max;
    }

    getMaxStringValue(): string {
        return `${this.max} ${this.suffix}`;
    }
}