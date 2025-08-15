import { makeAutoObservable } from "mobx";
import { EffectModel } from "../effect/effect";
import { ICtrlSettings } from "./ICtrlSettings";
import { ExpModule, IExpSettings } from "./IExpSettings";
import { FxLoopMode, IFxLoopSettings } from "./IFxLoopSettings";
import { IKnobSettings, KnobModule } from "./IKnobSettings";
import { ISyncEffectInfo, ISyncPresetInfo } from "./ISyncPresetInfo";


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
    exps: [
        [IExpSettings, IExpSettings, IExpSettings],
        [IExpSettings, IExpSettings, IExpSettings],
        [IExpSettings, IExpSettings, IExpSettings],
    ]

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
        this.exps = [presetInfo.exp1A, presetInfo.exp1B, presetInfo.exp2];

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

    clone(): PresetModel {
        // construct interface
        const efffectsInfo: ISyncEffectInfo[] = this.effects.map(e =>{
            // get param values
            const params = Array.from({length: 15}, (_, i) => 0);
            e.parameters.forEach((p) => {
                params[p.id] = p.getValue();
            });

            return {
                chainID: e.type,
                id: e.id,
                state: e.state, //or should it be a number?
                params: params, //15 elements not all used
            }
        });

        const presetInfo : ISyncPresetInfo = 
        {
            // General info
            name: this.name,
            number: this.number,

            // Settings
            volume: this.volume,
            bpm: this.bpm,
            pan: this.pan,
            effectsChainOrder: this.effectsChainOrder,

            // FXLOOP
            fxloop: this.fxLoop,

            // EXP

            exp1A: this.exps[0],
            exp1B: this.exps[1],
            exp2: this.exps[2],


            // KNOB
            knob1: this.knobs[0],
            knob2: this.knobs[1],
            knob3: this.knobs[2],

            // CTRL
            ctrl1: this.ctrls[0],
            ctrl2: this.ctrls[1],
            ctrl3: this.ctrls[2],
            ctrl4: this.ctrls[3],

            ctrl5: this.ctrls[4],
            ctrl6: this.ctrls[5],
            ctrl7: this.ctrls[6],
            ctrl8: this.ctrls[7],

            // Create Effect object class from string name
            effects: efffectsInfo,
        }

        return new PresetModel(presetInfo);
    }

    get bankCode(): string {
      const number = this.number;

      if (number === undefined) {
          return "";
      }

      const bankNumber = Math.floor(number / 4) + 1;
      let bankLetter: string = "";
      switch (number % 4) {
        case 0:
          bankLetter = 'A';
          break;
        case 1:
          bankLetter = 'B';
          break;
        case 2:
          bankLetter = 'C';
          break;
        case 3:
          bankLetter = 'D';
          break;
      }

      return bankNumber.toString().padStart(2, '0') + '-' + bankLetter;
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

    // FxLoop
    changeFxLoopPosition(sendPosition: number, returnPosition: number) {
        console.log("Changing position", sendPosition, returnPosition);
        this.fxLoop.sendPosition = sendPosition;
        this.fxLoop.returnPosition = returnPosition;
    }

    changeFxLoopReturnPosition(returnPosition: number) {
        console.log("Changing RETURN position", returnPosition);
        this.fxLoop.returnPosition = returnPosition;
    }

    changeFXLoopSendLevel(sendLevel: number) {
        if (this.fxLoop.sendLevel != sendLevel) {
            this.fxLoop.sendLevel = sendLevel;
        }
    }

    changeFxLoopReturnLevel(returnLevel: number) {
        this.fxLoop.returnLevel= returnLevel;
    }

    changeFxLoopMode(mode: number) {
        this.fxLoop.mode = mode;
    }


    // Knob
    changeKnobSettings(knobID: number, knobModule: KnobModule, knobParameter: number) {
        this.knobs[knobID].module = knobModule;
        this.knobs[knobID].paramID = knobParameter;
    }

    // CTRL
    changeCtrlSettings(ctrlID: number, pedalBinding: number[]) {
        this.ctrls[ctrlID].pedalsAssign = pedalBinding;
        this.ctrls[ctrlID].mode = 0; //fixed for now
    }

    // EXP
    changeExpSettings(expID: number, expParamID:number, expModule: ExpModule, paramID: number, paramMin: number, paramMax: number) {
        console.log("Update EXP",expID, expParamID, expModule, paramID, paramMin, paramMax );
        this.exps[expID][expParamID].module = expModule ;
        this.exps[expID][expParamID].paramNumber = paramID;
        this.exps[expID][expParamID].moduleParamNumberMin = paramMin;
        this.exps[expID][expParamID].moduleParamNumberMax = paramMax;
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