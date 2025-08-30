import { DefaultEffectsInfo } from "@/constants/DefaultEffects";
import { makeAutoObservable } from "mobx";
import { DeserializeParam, IParameter, ParamType } from "../parameter/IParameter";
import { Knob } from "../parameter/Knob";
import { Switch } from "../parameter/Switch";
import { ISyncEffectInfo } from "../preset/ISyncPresetInfo";
import { IDefaultEffect } from "./defaultEffect/IDefaultEffects";

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
    deserialize(ieffect: IDefaultEffect): EffectModel{
        //console.log('Received Effect Json = ', jsonObject);

        // Get typed parameter vector
        const deserializeParam = new DeserializeParam();

        let params: IParameter[];
        params = ieffect.params.map(p => deserializeParam.deserialize(p)) as IParameter[];

        let effectModule: keyof typeof EffectType;
        //effect_type = jsonObject['type'] as keyof typeof EffectType;
        effectModule = ieffect.module as keyof typeof EffectType;

        const e = new EffectModel(ieffect.name, ieffect.ID, "",
            EffectType[effectModule], true,
            params
        );

        //console.log("\nEffect = ", e);
        return e;
    }
}

export class EffectModel {
    name: string;
    ID: number;
    description: string;
    type: EffectType;
    // false -> turn off; true -> turn on
    state: boolean;
    parameters: IParameter[]
    activeBindParams: number[];
    hasBindParameters: boolean;


    constructor(name: string, ID: number, description: string, effect_type: EffectType, state: boolean, parameters: IParameter[]) {
        // TODO safety checks
        this.name = name;
        this.ID = ID;
        this.description = description;
        this.type = effect_type;
        this.state = state;
        this.parameters = parameters;
        this.activeBindParams = [];

        // Set if bind has parameters
        this.hasBindParameters = false;
        this.parameters.forEach(p => {
            if (p instanceof Knob) {
                if (p.bind !== null) {
                    this.hasBindParameters = true;
                }
            }
        })

        makeAutoObservable(this);
    }

    get typeName(): string {
        return EffectType[this.type];
    }

    changeState(state: boolean) {
        this.state = state;
    }

    get hasActiveBindParameter() {
        return this.activeBindParams.length !== 0;
    }


    setParameterValue(parameterID: number, value: number) {
        // const p = this.parameters.find(p => p.ID === parameterID);
        const params = this.parameters.filter(p => p.ID === parameterID);

        // Get the correct param
        let p: IParameter;
        if (params.length == 0) {
            throw new Error(`There is no parameter in effect ${this.name} with ID ${parameterID}`);
        } else if (params.length == 1) {
            p = params[0];
        } else if (params.length == 2) {
            // Get the currently use param (combox or knob)
            const combox_index = params.findIndex(p => p.type === ParamType.Combox);
            if (combox_index === -1) {
                throw new Error(`There should be one Combox parameter if there are 2 parameters in effect ${this.name} with ID ${parameterID}`);
            }

            if (this.activeBindParams.includes(parameterID)) {
                p = params[combox_index]
            } else {
                p = params[1 - combox_index];
            }
        } else {
            throw new Error(`There should not be more than 2 parameters in effect ${this.name} with ID ${parameterID}`);
        }


        // check bind parameters and activate them
        if (p instanceof Switch) {
            const bind_index = p.bind;

            //console.log("change parameter = ", other_param_name);
            if (bind_index != null && value !== 0) {
                // Add bind index to active bind 
                if (!this.activeBindParams.includes(bind_index)) {
                    this.activeBindParams.push(bind_index);
                }
                // Reset param
                const q = this.parameters.find(p => p.ID === bind_index && p.type === ParamType.Combox)
                q?.reset;
            } else if (bind_index != null && value == 0) {
                // remove bind from active bind
                this.activeBindParams = this.activeBindParams.filter(bind => bind !== bind_index);
                // Reset param
                const q = this.parameters.find(p => p.ID === bind_index && p.type === ParamType.Knob)
                q?.reset();
            }
        }

        // Set new value
        p.setValue(value);
        console.log("setting param", p.name, "value to", value);
    }


    static fromEffectInfo(effectInfo: ISyncEffectInfo): EffectModel {
        const e = this.defaultFromID(effectInfo.ID, effectInfo.chainID);
        console.log("Default effect", e);
        console.log("Effect params", e.parameters);

        // TODO: Update the parameter values and state
        e.changeState(effectInfo.state);

        for(let i = 0; i < e.parameters.length; i=i+1) {
            console.log("Effect param", e.parameters[i]);
            const ID = e.parameters[i].ID;
            e.setParameterValue(ID, effectInfo.paramValues[ID]);
            console.log(`Setting parameter ${ID} to value ${effectInfo.paramValues[ID]}`);
        }

        // e.parameters.forEach(p => {
        //     const id = p.id;
        //     e.setParameterValue(id, effectInfo.params[id]);
        //     console.log(`Setting parameter ${id} to value ${effectInfo.params[id]}`);
        // })

        return e;
    }

    static defaultFromID(effectID: number, effectType: EffectType): EffectModel {

        const deserializeEffect = new DeserializeEffect();

        // Get effects with given effectType
        const key: string = EffectType[effectType];
        const effectsInfo: IDefaultEffect[] = DefaultEffectsInfo[key as keyof typeof DefaultEffectsInfo];

        // Search for effect
        for(let i = 0; i < effectsInfo.length; i = i+1) {
            const effectInfo = effectsInfo[i];

            if (effectInfo.ID === effectID) {
                console.log("Found pedal", effectInfo.module, effectInfo.name, effectID);
                return deserializeEffect.deserialize(effectInfo);
            }
        }

        throw new Error(`Effect not found!, check correct ID ${effectID} - ${effectType}` );
    }
}