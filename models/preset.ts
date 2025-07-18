import { DefaultEffectsInfo } from "@/constants/DefaultEffects";
import { makeObservable, observable } from "mobx";
import { DeserializeEffect, EffectModel, EffectType } from "./effect/effect";
import { IEffect, IEffectsInfo } from "./effect/effectInfo";

type FxLoop = {
    // 0-11
    sendPosition: number;
    // 0-11
    returnPosition: number;
    // 0-100
    sendLevel: number;
    // 0-100
    returnLevel: number;
    // 0 -> parallel ; 1 -> series
    mode: number;
}

export class PresetModel {
    // preset number?
    // name
    name: string;
    chainOrder: number[];
    effects: EffectModel[];

    // Settings
    fxLoop: FxLoop;

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
        this.effects = [];
        this.effects.push(this.getEffect(preName, EffectType.PRE));
        this.effects.push(this.getEffect(wahName, EffectType.WAH));
        this.effects.push(this.getEffect(dstName, EffectType.DST));
        this.effects.push(this.getEffect(ampName, EffectType.AMP));
        this.effects.push(this.getEffect(nrName, EffectType.NR));
        this.effects.push(this.getEffect(cabName, EffectType.CAB));
        this.effects.push(this.getEffect(eqName, EffectType.EQ));
        this.effects.push(this.getEffect(modName, EffectType.MOD));
        this.effects.push(this.getEffect(dlyName, EffectType.DLY));
        this.effects.push(this.getEffect(rvbName, EffectType.RVB));
        this.effects.push(this.getEffect(volName, EffectType.VOL));

        // Settings
        this.fxLoop = {
           sendPosition: 0,
           returnPosition: 0,
           sendLevel: 0,
           returnLevel: 0,
           mode: 0
        }

        // MOBX
        makeObservable(this, {
            name: observable,
            chainOrder: observable,
            effects: observable,
            //decrementPresetNum: action,
        });
    }
    // savePreset(save_number, name)
    changeChainPosition(new_order: number[]) {
        this.chainOrder = new_order
    }

    getEffect(effectName: string, type: EffectType): EffectModel {

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


// default Gp200 preset
// export const default_preset = new PresetModel("It's GP-200",
//    // "Auto Swell", "V-Wah", "Green OD",
//     "Step Filter", "V-Wah", "Green OD",
//     "Tweedy", "Gate 1", "SUP ZEP",
//     "Mess EQ", "G-Chorus", "BBD Delay S",
//     "Room", "Volume"
//     );

export const default_preset = new PresetModel("Default",
    "Boost", "P-Wah", "Green OD",
    "Mess4 LD 3", "Auto Swell", "Mess",
    "Mess EQ", "M-Chorus", "Vintage Rack",
    "Plate", "Volume"
    );

// export const default_preset = new PresetModel("It's GP-200",
//     "Boost", "V-Wah", "Green OD",
//     "Tweedy", "Gate 1", "SUP ZEP",
//     "Mess EQ", "G-Chorus", "BBD Delay S",
//     "Room", "Volume"
//     );
// Presets array of 256 []