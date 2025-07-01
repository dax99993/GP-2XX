
export type Parameter = NumericParameter | SelectParameter;
export type ParameterValue = number | string;


export class NumericParameter {
    // Name of the parameter (ex. Threshold)
    name: string;
    // min value of parameter
    min_value: number;
    // max value of parameter
    max_value: number;
    // step size
    step_size: number;
    // current value
    current_value: number;

    constructor(name: string, min_value: number, max_value: number, step_size: number, default_value: number) {
        // Safety checkouts
        // non-empty name
        // min < max
        // step < (max - min)
        // default in range (min, max)

        this.name = name;
        this.min_value = min_value;
        this.max_value = max_value;
        this.step_size = step_size;
        this.current_value = default_value;
    }

    setValue(new_value: number) {
        // clamp value
        if (new_value > this.max_value) {
            this.current_value = this.max_value;
        }
        if (new_value < this.min_value) {
            this.current_value = this.min_value;
        }

        this.current_value = new_value;
    }

    // maybe get step
    // getValue
}

export class SelectParameter {
    name: string;
    selectable_values: string[];
    current_value: string;

    constructor(name: string, values: string[], default_value: string) {
        this.name = name;
        this.selectable_values = values;
        this.current_value = default_value
    }

    setValue(new_value: string) {
        if (this.selectable_values.includes(new_value) && new_value !== this.current_value) {
            this.current_value = new_value;
        }
    }
}