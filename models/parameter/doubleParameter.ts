import { IParameter, Labels } from "./parameter";

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

    // 0 -> numeric range, 1 -> selectable range with labels
    current_range_idx: number;

    constructor(name: string,
        min_value: number[], max_value: number[], step_size: number[], default_value: number[],
        units: string = "", labels: Labels,
        changes_param: string, numeric_type: string[])
    {
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
        // Start in first range (numeric)
        this.current_range_idx = 0;
    }

    setValue(value: number): number {
        const clamped_value = this.clampValue(value);
        this.current_value = [clamped_value];

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
    }
}