import { DefaultEffectsInfo } from "@/constants/DefaultEffects";
import { action, makeObservable, observable } from "mobx";
import { DeserializeParam, IParameter } from "../parameter/IParameter";
import { IGPEffectInfo } from "../preset/IGPPresetInfo";
import { IEffectInfo } from "./IEffectInfo";

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

    static fromGPEffectInfo(gpEffectInfo: IGPEffectInfo): EffectModel {
        return this.fromID(gpEffectInfo.id, gpEffectInfo.chainID);
    }

    static fromName(effectName: string, effectType: EffectType): EffectModel {

        const deserializeEffect = new DeserializeEffect();

        // Get effects with given effectType
        const key: string = EffectType[effectType];
        const effectsInfo: IEffectInfo[] = DefaultEffectsInfo[key as keyof typeof DefaultEffectsInfo];

        // Search for effect
        for(let i = 0; i < effectsInfo.length; i = i+1) {
            const effectInfo = effectsInfo[i];
            if (effectInfo.name === effectName && effectInfo.type === key) {
                console.log("Found pedal!", effectInfo.type, effectName);
                return deserializeEffect.deserialize(effectInfo);
            }
        }

        throw new Error(`Effect not found!, check correct ID ${effectName} - ${effectType}` );
    }

    static fromID(effectID: number[], effectType: EffectType): EffectModel {

        const deserializeEffect = new DeserializeEffect();

        // Get effects with given effectType
        const key: string = EffectType[effectType];
        const effectsInfo: IEffectInfo[] = DefaultEffectsInfo[key as keyof typeof DefaultEffectsInfo];

        // Search for effect
        for(let i = 0; i < effectsInfo.length; i = i+1) {
            const effectInfo = effectsInfo[i];
            const areIdEqual = arraysEqualShallow(effectInfo.id ,effectID);
            if (areIdEqual) {
                console.log("Found pedal!", effectInfo.type, effectID);
                return deserializeEffect.deserialize(effectInfo);
            }
        }

        throw new Error(`Effect not found!, check correct ID ${effectID} - ${effectType}` );
    }
}

function arraysEqualShallow(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
}
