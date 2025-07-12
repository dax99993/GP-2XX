import { DefaultEffectsInfo } from "@/constants/DefaultEffects";
import { makeObservable, observable } from "mobx";
import { DeserializeEffect, Effect, EffectType } from "./effect/effect";
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
    amp: Effect;
    nr: Effect;
    cab: Effect;
    eq: Effect;
    mod: Effect;
    dly: Effect;
    rvb: Effect;
    vol: Effect;

    // category
    // author
    // description


    // METHODS
    constructor(name: string,
        preName: string, wahName: string, dstName: string,
        ampName: string, nrName: string, cabName: string,
        eqName: string, modName: string, dlyName: string,
        rvbName: string, volName: string
    ) {
        this.name = name;
        this.chainOrder = [0,1,2,3,4,5,6,7,8,9,10];

        // Create Effect object class from string name
        this.pre = this.getEffect(preName, EffectType.PRE);
        this.wah = this.getEffect(wahName, EffectType.WAH);
        this.dst = this.getEffect(dstName, EffectType.DST);
        this.amp = this.getEffect(ampName, EffectType.AMP);
        this.nr = this.getEffect(nrName, EffectType.NR);
        this.cab = this.getEffect(cabName, EffectType.CAB);
        this.eq= this.getEffect(eqName, EffectType.EQ);
        this.mod= this.getEffect(modName, EffectType.MOD);
        this.dly= this.getEffect(dlyName, EffectType.DLY);
        this.rvb= this.getEffect(rvbName, EffectType.RVB);
        this.vol= this.getEffect(volName, EffectType.VOL);


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

    getEffect(effectName: string, type: EffectType): Effect {

        const deserializeEffect = new DeserializeEffect();

        let eff: Effect;
        const effectsInfo: IEffectsInfo[] = Object.values(DefaultEffectsInfo);
        //console.log(Object.values(DefaultEffectsInfo));
        effectsInfo.forEach(effectsInfo => {
            const effectInfo: IEffect[] = Object.values(effectsInfo);
            effectInfo.forEach(e => {
                //console.log(e);
                if (e.name === effectName && e.type == EffectType[type]) {
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
export const default_preset = new Preset("It's GP-200",
    "Boost", "V-Wah", "Green OD",
    "Tweedy", "Gate 1", "SUP ZEP",
    "Guitar EQ1", "G-Chorus", "BBD Delay S",
    "Room", "Volume"
    );
// Presets array of 256 []