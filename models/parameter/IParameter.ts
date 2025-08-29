import { Combox } from "./Combox";
import { ICombox } from "./ICombox";
import { IKnob } from "./IKnob";
import { ISlider } from "./ISlider";
import { ISwitch } from "./ISwitch";
import { Knob } from "./Knob";
import { Slider } from "./Slider";
import { Switch } from "./Switch";

export enum ParamType {
    Slider = 0,
    Knob = 1,
    Combox = 2,
    Switch = 3,
}

export interface IParameter {
    // General props
    name: string;
    index: number;
    ID: number;
    default: number;
    type: ParamType;

    currentValue: number;
    min: number;
    max: number;
    step: number;
    // Type of values in ranges
    //numeric_type: string[];


    // General methods
    setValue(value: number): number;
    getValue(): number;
    getCurrentValueAsString(): string;
    getValueAsString(n: number): string;
    getName(): string;

    // util methods
    clampValue(value: number): number;

    // for exp settings
    getCurrentStep(): number;
    getMinValue(): number;
    getMinStringValue(): string;
    getMaxValue(): number;
    getMaxStringValue(): string;
}


export class DeserializeParam {
    //deserialize(p: IDefaultParameterInfo): IParameter {
    deserialize(p: IKnob | ISlider | ISwitch | ICombox): IParameter {
        //console.log("RECEIVED JSON: ", jsonObject);

        switch(p.type) {
            case ParamType.Slider:
                //console.log('Select param')
                return new Slider(p as ISlider);
            case ParamType.Knob:
                //console.log('Numeric param')
                return new Knob(p as IKnob);
            case ParamType.Combox:
                return new Combox(p as ICombox);
            case ParamType.Switch:
                //console.log('Double param')
                return new Switch(p as ISwitch);
        }

    }
}
