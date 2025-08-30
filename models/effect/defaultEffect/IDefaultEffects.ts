import { ICombox } from "@/models/parameter/ICombox";
import { IKnob } from "@/models/parameter/IKnob";
import { ISlider } from "@/models/parameter/ISlider";
import { ISwitch } from "@/models/parameter/ISwitch";

export interface IDefaultEffect {
    name: string;
    index: number;
    ID: number;
    module: string;
    cabCode: number | null;
    params: [IKnob | ISlider | ISwitch | ICombox];
}

export interface IDefaultEffects {
  PRE: IDefaultEffect[]
  WAH: IDefaultEffect[]
  DST: IDefaultEffect[]
  AMP: IDefaultEffect[]
  NR:  IDefaultEffect[]
  CAB: IDefaultEffect[]
  EQ:  IDefaultEffect[]
  MOD: IDefaultEffect[]
  DLY: IDefaultEffect[]
  RVB: IDefaultEffect[]
  VOL: IDefaultEffect[]
}