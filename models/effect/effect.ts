import { DefaultEffectsInfo } from "@/constants/DefaultEffects";
import { action, makeObservable, observable } from "mobx";
import { DeserializeParam, IParameter } from "../parameter/parameter";
import { IEffect, IEffectsInfo } from "./effectInfo";

// this also encodes the natural order of pedal types id in default chain order
export enum EffectType {
    PRE = 0,
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

export class DeserializeEffect {
    deserialize(ieffect: IEffect): EffectModel {
        //console.log('Received Effect Json = ', jsonObject);

        // Get typed parameter vector
        const deserializeParam = new DeserializeParam();

        let params: IParameter[];
        params = ieffect.params.map(p => deserializeParam.deserialize(p)) as IParameter[];

        let effect_type: keyof typeof EffectType;
        //effect_type = jsonObject['type'] as keyof typeof EffectType;
        effect_type = ieffect.type as keyof typeof EffectType;

        const e = new EffectModel(ieffect.name, ieffect.id, ieffect.description,
            EffectType[effect_type], true,
            params
        );

        //console.log("\nEffect = ", e);
        return e;
    }
}

export class EffectModel {
    name: string;
    id: number[];
    description: string;
    type: EffectType;
    // false -> turn off; true -> turn on
    state: boolean;
    parameters: IParameter[]
    //position

    constructor(name: string, id: number[], description: string, effect_type: EffectType, state: boolean, parameters: IParameter[]) {
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
            changeState: action,
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

    changeState(state: boolean) {
        this.state = state;
    }


    static from(effectName: string, type: EffectType): EffectModel {

        const deserializeEffect = new DeserializeEffect();

        let eff: EffectModel;
        const effectsInfo: IEffectsInfo[] = Object.values(DefaultEffectsInfo);
        //console.log(Object.values(DefaultEffectsInfo));
        effectsInfo.forEach(effectsInfo => {
            const effectInfo: IEffect[] = Object.values(effectsInfo);
            effectInfo.forEach(e => {
                //console.log(e);
                if (e.name === effectName && e.type == EffectType[type]) {
                    console.log("Found pedal!", e.type, effectName);
                    eff = deserializeEffect.deserialize(e);
                }
            })
        });

        return eff;
    }
}






