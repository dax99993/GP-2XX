import { IDefaultParameterInfo } from "../effect/defaultEffect/IParameterInfo";
import { DoubleParameterModel } from "./doubleParameter";
import { NumericParameterModel } from "./numericParameter";
import { SelectParameterModel } from "./selectParameter";

export type Labels = Record<number, string>;

export interface IParameter {
    // General props
    name: string;
    type: string;
    min_value: number[];
    max_value: number[];
    step_size: number[];
    default_value: number[];
    current_value: number[];
    // Only a subset of parameteres have units others are adimensional (empty units "")
    units: string;
    // Only for parameter with finite select options or Numeric with Off label and Double parameters others have empty label array
    labels: Labels;
    // Only for parameters that activate with double parameters range
    changes_param: string;
    // Type of values in ranges
    numeric_type: string[];

    id: number;

    // General methods
    setValue(value: number): number;
    getValue(): number;
    getStringValue(): string;
    getName(): string;

    // util methods
    clampValue(value: number): number;

    // for exp settings
    getMinValue(): number;
    getMinStringValue(): string;
    getMaxValue(): number;
    getMaxStringValue(): string;
}


export class DeserializeParam {
    deserialize(p: IDefaultParameterInfo): IParameter {
        //console.log("RECEIVED JSON: ", jsonObject);

        switch(p.type) {
            case 'Numeric':
                //console.log('Numeric param')
                return new NumericParameterModel(
                    p.name, p.id,
                    p.min_value[0], p.max_value[0], p.step_size[0], p.default_value[0],
                    p.units, p.labels,
                    p.numeric_type, p.changes_param
                );
            case 'Select':
                //console.log('Select param')
                return new SelectParameterModel(
                    p.name, p.id,
                    p.min_value[0], p.max_value[0], p.step_size[0], p.default_value[0],
                    p.units, p.labels,
                    p.numeric_type, p.changes_param
                );
            case 'Double':
                //console.log('Double param')
                return new DoubleParameterModel(
                    p.name, p.id,
                    p.min_value, p.max_value, p.step_size, p.default_value,
                    p.units, p.labels,
                    p.numeric_type, p.changes_param
                );
        }

        throw new Error("DefaulEffectInfo should only contain type Numeric, Select or Double.");
    }
}
