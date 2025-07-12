import { DefaultEffectsInfo } from "@/constants/DefaultEffects";
import { makeObservable, observable } from "mobx";
import { DeserializeEffect, Effect } from "./effect/effect";
import { IEffect, IEffectsInfo } from "./effect/effectInfo";

export class Preset {
    // preset number?
    // name
    name: string;
    // effects or effect chain    
    chainOrder: number[];

    pre: Effect;
    wah: Effect;
    dst: Effect;
    nr: Effect;

    // category
    // author
    // description


    // METHODS
    constructor(name: string,
        preName: string, wahName: string, dstName: string, nrName: string
    ) {
        this.name = name;
        this.chainOrder = [0,1,2,3,4,5,6,7,8,9,10];

        // Create Effect object class from string name
        this.pre = this.getEffect(preName);
        this.wah = this.getEffect(wahName);
        this.dst = this.getEffect(dstName);

        this.nr = this.getEffect(nrName);

        // MOBX
        makeObservable(this, {
            name: observable,
            chainOrder: observable,
            pre: observable,
            wah: observable,
            dst: observable,
            nr: observable,
            //decrementPresetNum: action,
        });
    }
    // savePreset(save_number, name)
    changeChainPosition(new_order: number[]) {
        this.chainOrder = new_order
    }

    getEffect(effectName: string): Effect {

        const deserializeEffect = new DeserializeEffect();

        let eff: Effect;
        const effectsInfo: IEffectsInfo[] = Object.values(DefaultEffectsInfo);
        console.log(Object.values(DefaultEffectsInfo));
        effectsInfo.forEach(effectsInfo => {
            const effectInfo: IEffect[] = Object.values(effectsInfo);

            effectInfo.forEach(e=> {
                //console.log(effect.name);
                if (e.name === effectName) {
                    console.log("Found pedal!", effectName);
                    eff = deserializeEffect.deserialize(e);
                }
            })
        });

        return eff;
    }
}


// default Gp200 preset
// pre Boost,
export const default_preset = new Preset("It's GP-200", "Boost", "P-Wah", "Green OD", "Gate 1");
// Presets array of 256 []