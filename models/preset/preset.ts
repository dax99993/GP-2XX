import { makeAutoObservable } from "mobx";
import { EffectModel } from "../effect/effect";
import { ICtrlSettings } from "./ICtrlSettings";
import { ExpModule, IExpSettings } from "./IExpSettings";
import { FxLoopMode, IFxLoopSettings } from "./IFxLoopSettings";
import { IKnobSettings, KnobModule } from "./IKnobSettings";
import { ISyncPresetInfo } from "./ISyncPresetInfo";

// type FxLoop = {
//     // 0-11
//     sendPosition: number;
//     // 0-11
//     returnPosition: number;
//     // 0-100
//     sendLevel: number;
//     // 0-100
//     returnLevel: number;
//     // 0 -> parallel ; 1 -> series
//     mode: number;
// }

export class PresetModel {
    // General info
    name: string;
    number: number;

    // category
    // author
    // description

    // Settings
    volume: number;
    pan: number;
    bpm: number;
    effectsChainOrder: number[];

    // FXLOOP
    fxLoop: IFxLoopSettings;

    // EXP
    exp1A: [IExpSettings, IExpSettings, IExpSettings];
    exp1B: [IExpSettings, IExpSettings, IExpSettings];
    exp2: [IExpSettings, IExpSettings, IExpSettings];

    // KNOB
    knobs: [IKnobSettings, IKnobSettings, IKnobSettings];

    // CTRL
    ctrls: [
        ICtrlSettings, ICtrlSettings, ICtrlSettings, ICtrlSettings,
        ICtrlSettings, ICtrlSettings, ICtrlSettings, ICtrlSettings
    ];

    // EFFECTS
    effects: EffectModel[];

    // METHODS
    constructor(presetInfo: ISyncPresetInfo) {
        // General info
        this.name = presetInfo.name;
        this.number = presetInfo.number;

        // Settings
        this.volume = presetInfo.volume;
        this.bpm = presetInfo.bpm;
        this.pan = presetInfo.pan;
        this.effectsChainOrder = presetInfo.effectsChainOrder;

        // FXLOOP
        this.fxLoop = presetInfo.fxloop;

        // EXP
        this.exp1A = presetInfo.exp1A;
        this.exp1B = presetInfo.exp1B;
        this.exp2 = presetInfo.exp2;

        // KNOB
        this.knobs = [presetInfo.knob1, presetInfo.knob2, presetInfo.knob3];

        // CTRL
        this.ctrls = [
            presetInfo.ctrl1, presetInfo.ctrl2, presetInfo.ctrl3, presetInfo.ctrl4,
            presetInfo.ctrl5, presetInfo.ctrl6, presetInfo.ctrl7, presetInfo.ctrl8
        ];


        // Create Effect object class from string name
        this.effects = presetInfo.effects.map((effectInfo) => EffectModel.fromEffectInfo(effectInfo));


        // // MOBX
        makeAutoObservable(this);
        // makeObservable(this, {
        //     name: observable,
        //     number: observable,
        //     effectsChainOrder: observable,

        //     // Settings
        //     effects: observable,
        //     //decrementPresetNum: action,


        // });

    }

    static default(): PresetModel {
        return new PresetModel(itsGP200);
    }
    // savePreset(save_number, name)

    // actions
    changeEffectsChainOrder(order: number[]) {
        this.effectsChainOrder = order
    }

    // settings
    changeVolume(vol: number) {
        this.volume = vol;
    }

    changePan(pan: number) {
        this.pan = pan;
    }

    changeBPM(bpm: number) {
        this.bpm = bpm;
    }

    changeFxLoopPosition(sendPosition: number, returnPosition: number) {
        this.fxLoop.sendPosition = sendPosition;
        this.fxLoop.returnPosition = returnPosition;
    }

    changeKnobSettings(knobID: number, knobModule: KnobModule, knobParameter: number) {
        this.knobs[knobID].module = knobModule;
        this.knobs[knobID].paramID = knobParameter;
    }

    changeCtrlSettings(ctrlID: number, pedalBinding: number[]) {
        this.ctrls[ctrlID].pedalsAssign = pedalBinding;
        this.ctrls[ctrlID].mode = 0; //fixed for now
    }

}


// default Gp200 preset
// export const default_preset = new PresetModel(2, "Default",
//     "Boost", "P-Wah", "Green OD",
//     "Mess4 LD 3", "Auto Swell", "Mess",
//     "Mess EQ", "M-Chorus", "Vintage Rack",
//     "Plate", "Volume"
//     );


// default GP200 preset
const itsGP200 : ISyncPresetInfo = {
    name: "It's GP-200",
    number: 0,
    volume: 50,
    pan: 0,
    bpm: 120,

    effectsChainOrder: [0,1,2,3,4,5,6,7,8,9,10],

    fxloop: {
        sendLevel: 0,
        returnLevel: 0,
        sendPosition: 4,
        returnPosition: 4,
        mode: FxLoopMode.Parallel
    },

    knob1: {
        number: 0,
        module: KnobModule.OFF,
        paramID: 0
    },
    knob2: {
        number: 1,
        module: KnobModule.OFF,
        paramID: 0
    },
    knob3: {
        number: 0,
        module: KnobModule.PATCHVOL,
        paramID: 0
    },

    ctrl1: {
        number: 0,
        mode: 0,
        pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0]
    },

    ctrl2: {
        number: 1,
        mode: 0,
        pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0]
    },

    ctrl3: {
        number: 2,
        mode: 0,
        pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0]
    },
    ctrl4: {
        number: 3,
        mode: 0,
        pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0]
    },
    ctrl5: {
        number: 4,
        mode: 0,
        pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0]
    },
    ctrl6: {
        number: 5,
        mode: 0,
        pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0]
    },
    ctrl7: {
        number: 6,
        mode: 0,
        pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0]
    },
    ctrl8: {
        number: 7,
        mode: 0,
        pedalsAssign: [0,0,0,0,0,0,0,0,0,0,0]
    },

    exp1A: [
    {
        id: 0,
        paramNumber: 0,
        module: ExpModule.VOL,
        moduleParamID: 0,
        moduleParamNumberMin: 0,
        moduleParamNumberMax: 100
    },
    {
        id: 0,
        paramNumber: 1,
        module: ExpModule.OFF,
        moduleParamID: 0,
        moduleParamNumberMin: 0,
        moduleParamNumberMax: 100, 
    },
    {
        id: 0,
        paramNumber: 2,
        module: ExpModule.OFF,
        moduleParamID: 0,
        moduleParamNumberMin: 0,
        moduleParamNumberMax: 100
    },
],
    exp1B: [
    {
        id: 0,
        paramNumber: 0,
        module: ExpModule.WAH,
        moduleParamID: 3,
        moduleParamNumberMin: 0,
        moduleParamNumberMax: 100
    },
    {
        id: 0,
        paramNumber: 1,
        module: ExpModule.OFF,
        moduleParamID: 0,
        moduleParamNumberMin: 0,
        moduleParamNumberMax: 100, 
    },
    {
        id: 0,
        paramNumber: 2,
        module: ExpModule.OFF,
        moduleParamID: 0,
        moduleParamNumberMin: 0,
        moduleParamNumberMax: 100
    },
    ],
    exp2: [
    {
        id: 0,
        paramNumber: 0,
        module: ExpModule.OFF,
        moduleParamID: 0,
        moduleParamNumberMin: 0,
        moduleParamNumberMax: 100
    },
    {
        id: 0,
        paramNumber: 1,
        module: ExpModule.OFF,
        moduleParamID: 0,
        moduleParamNumberMin: 0,
        moduleParamNumberMax: 100, 
    },
    {
        id: 0,
        paramNumber: 2,
        module: ExpModule.OFF,
        moduleParamID: 0,
        moduleParamNumberMin: 0,
        moduleParamNumberMax: 100
    },
    ],
    effects: [
        // COMP
        {
            chainID: 0,
            id: [0,0,0,0,0,0,0,0],
            state: false,
            params: [20, 50]
        }
    ]
}