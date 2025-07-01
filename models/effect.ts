import { Parameter, ParameterValue } from "./parameter";

enum EffectType {
    PRE,
    WAH,
    DST,
    AMP,
    NR,
    CAB,
    EQ,
    MOD,
    DLY,
    RVB,
    VOL
}


class Effect {
    name: string;
    description: string;
    type: EffectType;
    state: boolean;
    parameters: Parameter[]

    constructor(name: string, description: string, effect_type: EffectType, state: boolean, parameters: Parameter[]) {
        // TODO safety checks
        this.name = name;
        this.description = description;
        this.type = effect_type;
        this.state = state;
        this.parameters = parameters;
    }

    setParameterValue(parameter_name: string, new_value: ParameterValue) {
        this.parameters.forEach( parameter => {
            if (parameter.name === parameter_name) {
                if (typeof new_value === "string")
                    parameter.setValue(new_value as string);
                else 
                    parameter.setValue(new_value as number);

            }
        } )
    }
}