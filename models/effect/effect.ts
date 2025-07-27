import { DefaultEffectsInfo } from "@/constants/DefaultEffects";
import { action, makeObservable, observable } from "mobx";
import { DeserializeParam, IParameter } from "../parameter/IParameter";
import { IEffectInfo } from "./IEffectInfo";
import { IEffectsInfo } from "./IEffectsInfo";

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
    deserialize(ieffect: IEffectInfo): EffectModel{
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
            const effectInfo: IEffectInfo[] = Object.values(effectsInfo);
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

    static fromID(effectID: number[], effectType: EffectType): EffectModel {

        const deserializeEffect = new DeserializeEffect();

        let eff: EffectModel;
        const effectsInfo: IEffectsInfo[] = Object.values(DefaultEffectsInfo);

        effectsInfo.forEach(effectsInfo => {
            const effectInfo: IEffectInfo[] = Object.values(effectsInfo);
            effectInfo.forEach(e => {
                const areEqual = arraysEqualShallow(e.id ,effectID);
                //console.log("Compare IDS", e.type, e.id, effectID, areEqual);
                if ( areEqual && e.type === EffectType[effectType] ) {
                    console.log("Found pedal!", e.type, e.name, e.id);
                    //return deserializeEffect.deserialize(e);
                    eff = deserializeEffect.deserialize(e);
                }
            })
        });

        //throw new Error(`Effect not found!, check correct ID ${effectID}` );
        return eff;
    }
}

function arraysEqualShallow(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
}






