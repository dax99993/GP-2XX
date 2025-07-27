import { IParameter, Labels } from "@/models/parameter/IParameter";
import { makeAutoObservable } from "mobx";

export class NumericParameterModel implements IParameter {
    type: string = "Numeric";
    // Name of the parameter (ex. Threshold)
    name: string;
    // min value of parameter
    min_value: number[];
    // max value of parameter
    max_value: number[];
    // step size
    step_size: number[];
    // current value
    default_value: number[];
    // current value
    current_value: number[];

    units: string;
    labels: Labels;
    changes_param: string;
    numeric_type: string[];
    id: number;


    // This only has one parameter
    constructor(name: string, id: number,
        min_value: number, max_value: number, step_size: number, default_value: number,
        units: string = "", labels: Labels,
        numeric_type: string[], changes_param: string) {
        // Safety checkouts
        // non-empty name
        // min < max
        // step < (max - min)
        // default in range (min, max)
        // check for labels

        this.name = name;
        this.min_value = [min_value];
        this.max_value = [max_value];
        this.step_size = [step_size];
        this.default_value = [default_value];
        this.current_value = [default_value];
        this.units = units;
        this.labels = labels;
        this.changes_param = changes_param;
        this.numeric_type = numeric_type;
        this.id = id;

        makeAutoObservable(this);
    }

    getValue(): number {
        return this.current_value[0];
    }

    getStringValue(): string {
        // check if labels for such value exists
        if (this.current_value[0].toString() in this.labels) {
            return `${this.labels[this.current_value[0]]}`
        } else {
            return `${this.current_value[0]} ${this.units}`
        }
    }

    getName(): string {
        return this.name;
    }

    setValue(new_value: number) {
        const value = this.clampValue(new_value);
        this.current_value = [value];

        return value;
    }

    clampValue(value: number): number {
        return Math.max(this.min_value[0], Math.min(value, this.max_value[0]));
    }
}