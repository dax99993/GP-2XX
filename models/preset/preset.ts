import { makeObservable, observable } from "mobx";
import { EffectModel, EffectType } from "../effect/effect";
import { IGPPresetInfo } from "./IGPPresetInfo";

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
    number: number;

    // Settings
    fxLoop: FxLoop;

    // category
    // author
    // description


    // METHODS
    constructor(number: number, name: string,
        preName: string, wahName: string, dstName: string,
        ampName: string, nrName: string, cabName: string,
        eqName: string, modName: string, dlyName: string,
        rvbName: string, volName: string
    ) {
        this.name = name;
        this.number = number;
        this.chainOrder = [0,1,2,3,4,5,6,7,8,9,10];

        // Create Effect object class from string name
        this.effects = [];
        this.effects.push(EffectModel.fromName(preName, EffectType.PRE));
        this.effects.push(EffectModel.fromName(wahName, EffectType.WAH));
        this.effects.push(EffectModel.fromName(dstName, EffectType.DST));
        this.effects.push(EffectModel.fromName(ampName, EffectType.AMP));
        this.effects.push(EffectModel.fromName(nrName, EffectType.NR));
        this.effects.push(EffectModel.fromName(cabName, EffectType.CAB));
        this.effects.push(EffectModel.fromName(eqName, EffectType.EQ));
        this.effects.push(EffectModel.fromName(modName, EffectType.MOD));
        this.effects.push(EffectModel.fromName(dlyName, EffectType.DLY));
        this.effects.push(EffectModel.fromName(rvbName, EffectType.RVB));
        this.effects.push(EffectModel.fromName(volName, EffectType.VOL));

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

    static fromGPPresetInfo(presetInfo: IGPPresetInfo): PresetModel {
        //Get the effects
        let effects = [];
        for (let i =0; i < presetInfo.effects.length; i=i+1) {
            effects.push(EffectModel.fromGPEffectInfo(presetInfo.effects[i]));
        }

        // Create the Preset
        const preset = new PresetModel(presetInfo.number, presetInfo.name,
            effects[0].name,
            effects[1].name,
            effects[2].name,
            effects[3].name,
            effects[4].name,
            effects[5].name,
            effects[6].name,
            effects[7].name,
            effects[8].name,
            effects[9].name,
            effects[10].name,
        );

        return preset;
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

export const default_preset = new PresetModel(2, "Default",
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