import { IParameterInfo } from "../parameter/parameterInfo"

export interface IEffectsInfo {
  PRE: IEffect[]
  WAH: IEffect[]
  DST: IEffect[]
  AMP: IEffect[]
  NR: IEffect[]
  CAB: IEffect[]
  EQ: IEffect[]
  MOD: IEffect[]
  DLY: IEffect[]
  RVB: IEffect[]
  VOL: IEffect[]
}

export interface IEffect {
  name: string
  id: number[]
  param_num: number
  params: IParameterInfo[]
  type: string
  description: string
}
