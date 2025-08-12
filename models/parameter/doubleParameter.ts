import { makeAutoObservable } from "mobx";
import { IParameter, Labels } from "./IParameter";

export class DoubleParameterModel implements IParameter {
    type: string = "Double";
    name: string;
    min_value: number[];
    max_value: number[];
    step_size: number[];
    default_value: number[];
    current_value: number[];

    units: string;
    labels: Labels;
    changes_param: string;
    numeric_type: string[];
    id: number;

    // 0 -> numeric range, 1 -> selectable range with labels
    current_range_idx: number;

    constructor(name: string, id: number,
        min_value: number[], max_value: number[], step_size: number[], default_value: number[],
        units: string = "", labels: Labels,
        numeric_type: string[], changes_param: string
    ) {
        this.name = name;
        this.min_value = min_value;
        this.max_value = max_value;
        this.step_size = step_size;
        this.default_value = default_value;
        this.current_value = default_value;
        this.units = units;
        this.labels = labels;
        this.changes_param = changes_param;
        this.numeric_type = numeric_type;
        this.id = id;
        // Start in first range (numeric)
        this.current_range_idx = 0;

        makeAutoObservable(this);
    }

    getMinValue(): number {
        return this.min_value[this.current_range_idx];
    }

    getMinStringValue(): string {
        const min = this.getMinValue();
        if (min.toString() in this.labels) {
            return `${this.labels[min]}`
        } else {
            return `${min} ${this.units}`
        }
    }

    getMaxValue(): number {
        return this.max_value[this.current_range_idx];
    }

    getMaxStringValue(): string {
        const max = this.getMaxValue();
        if (max.toString() in this.labels) {
            return `${this.labels[max]}`
        } else {
            return `${max} ${this.units}`
        }
    }

    setValue(value: number): number {
        const clamped_value = this.clampValue(value);
        // set on currently active range
        this.current_value[this.current_range_idx] = clamped_value;

        return clamped_value;
    }

    getValue(): number {
        return this.current_value[this.current_range_idx];
    }

    getStringValue(): string {
        if (this.current_range_idx === 0) {
            return `${this.current_value[this.current_range_idx]} ${this.units}`
        } else {
            return this.labels[this.current_value[this.current_range_idx]];
        }
    }

    getName(): string {
        return this.name;
    }

    clampValue(value: number): number {
        return Math.max(this.min_value[this.current_range_idx], Math.min(value, this.max_value[this.current_range_idx]));
    }

    activeSecondRange(active: boolean) {
        if (active) {
            this.current_range_idx = 1;
        } else {
            this.current_range_idx = 0;
        }
        this.current_value = this.default_value;
    }
}