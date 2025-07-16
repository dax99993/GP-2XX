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


    // General methods
    setValue(value: number): number;
    getValue(): number;
    getStringValue(): string;
    getName(): string;

    // util methods
    clampValue(value: number): number;
}


export class DeserializeParam {
    deserialize(jsonObject: any): IParameter {
        //console.log("RECEIVED JSON: ", jsonObject);

        switch(jsonObject['type']) {
            case 'Numeric':
                //console.log('Numeric param')
                return new NumericParameterModel(jsonObject['name'],
                    jsonObject['min_value'][0], jsonObject['max_value'][0], jsonObject['step_size'][0], jsonObject['default_value'][0],
                    jsonObject['units'], jsonObject['labels'],
                    jsonObject['numeric_type'], jsonObject['changes_param']);
            case 'Select':
                //console.log('Select param')
                return new SelectParameterModel(jsonObject['name'],
                    jsonObject['min_value'][0], jsonObject['max_value'][0], jsonObject['step_size'][0], jsonObject['default_value'][0],
                    jsonObject['units'], jsonObject['labels'],
                    jsonObject['numeric_type'], jsonObject['changes_param']);
            case 'Double':
                //console.log('Double param')
                return new DoubleParameterModel(jsonObject['name'],
                    jsonObject['min_value'], jsonObject['max_value'], jsonObject['step_size'], jsonObject['default_value'],
                    jsonObject['units'], jsonObject['labels'],
                    jsonObject['numeric_type'], jsonObject['changes_param']);
        }

        throw new Error("Should not reach this");
    }
}