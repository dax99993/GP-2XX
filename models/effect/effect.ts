import { action, makeObservable, observable } from "mobx";
import { DeserializeParam, Parameter } from "../parameter/parameter";

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


export class Effect {
    name: string;
    id: number[];
    description: string;
    type: EffectType;
    // false -> turn off; true -> turn on
    state: boolean;
    parameters: Parameter[]
    //position

    constructor(name: string, id: number[], description: string, effect_type: EffectType, state: boolean, parameters: Parameter[]) {
        // TODO safety checks
        this.name = name;
        this.id = id;
        this.description = description;
        this.type = effect_type;
        this.state = state;
        this.parameters = parameters;

        makeObservable(this, {
            state: observable,
            parameters: observable,
            toggleState: action,
            //decrementPresetNum: action,
        });
    }

    setParameterValue(parameter_name: string, new_value: number) {
        this.parameters.forEach( parameter => {
            if (parameter.name === parameter_name) {
                parameter.setValue(new_value);
            }
        } )
    }

    toggleState() {
        this.state = !this.state;
    }
}


export class DeserializeEffect {
    deserialize(jsonObject: any): Effect {
        //console.log('Received Effect Json = ', jsonObject);

        // Get typed parameter vector
        const deserializeParam = new DeserializeParam();

        let params: Parameter[];
        params = jsonObject["params"].map(p => deserializeParam.deserialize(p)) as Parameter[];

        let effect_type: keyof typeof EffectType;
        effect_type = jsonObject['type'] as keyof typeof EffectType;

        const e = new Effect(jsonObject['name'], jsonObject['id'], jsonObject["description"],
            EffectType[effect_type], true,
            params
        );

        //console.log("\nEffect = ", e);
        return e;
    }
}




