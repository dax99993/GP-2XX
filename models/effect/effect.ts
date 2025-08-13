import { DefaultEffectsInfo } from "@/constants/DefaultEffects";
import { makeAutoObservable } from "mobx";
import { DoubleParameterModel } from "../parameter/doubleParameter";
import { DeserializeParam, IParameter } from "../parameter/IParameter";
import { ISyncEffectInfo } from "../preset/ISyncPresetInfo";
import { IDefaultEffectInfo } from "./defaultEffect/IDefaultEffectInfo";

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
    deserialize(ieffect: IDefaultEffectInfo): EffectModel{
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


    constructor(name: string, id: number[], description: string, effect_type: EffectType, state: boolean, parameters: IParameter[]) {
        // TODO safety checks
        this.name = name;
        this.id = id;
        this.description = description;
        this.type = effect_type;
        this.state = state;
        this.parameters = parameters;

        // makeObservable(this, {
        //     state: observable,
        //     parameters: observable,

        //     changeState: action,
        //     setParameterValue: action,
        // });
        makeAutoObservable(this);
    }

    get typeName(): string {
        return EffectType[this.type];
    }

    changeState(state: boolean) {
        this.state = state;
    }

    // setParameterValue(parameter_name: string, new_value: number) {
    //     this.parameters.forEach( parameter => {
    //         if (parameter.name === parameter_name) {
    //             parameter.setValue(new_value);
    //         }
    //     } )

    setParameterValue(parameterID: number, value: number) {
        const p = this.parameters.filter(p => p.id === parameterID);

        if (p.length == 0) {
            throw new Error(`There is no parameter in effect ${this.name} with ID ${parameterID}`);
        }

        p[0].setValue(value);
        console.log("setting param", p[0].name, "value to", value);

        // check for double parameters
        const other_param_name = p[0].changes_param;
        //console.log("change parameter = ", other_param_name);
        if (other_param_name != "") {
            const q = this.parameters.filter(p => p.name === other_param_name);
            if (q[0].type === "Double") {
                const w = q[0] as DoubleParameterModel;
                w.activeSecondRange(value != 0);
            }
        }
    }


    static fromEffectInfo(effectInfo: ISyncEffectInfo): EffectModel {
        const e = this.defaultfromID(effectInfo.id, effectInfo.chainID);

        // TODO: Update the parameter values and state
        e.changeState(effectInfo.state);

        for(let i = 0; i < e.parameters.length; i=i+1) {
            const id = e.parameters[i].id;
            e.setParameterValue(id, effectInfo.params[id]);
            console.log(`Setting parameter ${id} to value ${effectInfo.params[id]}`);
        }

        // e.parameters.forEach(p => {
        //     const id = p.id;
        //     e.setParameterValue(id, effectInfo.params[id]);
        //     console.log(`Setting parameter ${id} to value ${effectInfo.params[id]}`);
        // })

        return e;
    }

    static defaultfromID(effectID: number[], effectType: EffectType): EffectModel {

        const deserializeEffect = new DeserializeEffect();

        // Get effects with given effectType
        const key: string = EffectType[effectType];
        const effectsInfo: IDefaultEffectInfo[] = DefaultEffectsInfo[key as keyof typeof DefaultEffectsInfo];

        // Search for effect
        for(let i = 0; i < effectsInfo.length; i = i+1) {
            const effectInfo = effectsInfo[i];
            const areIdEqual = arraysEqualShallow(effectInfo.id ,effectID);
            if (areIdEqual) {
                console.log("Found pedal", effectInfo.type, effectInfo.name, effectID);
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
