import { IEffectChangeInfo } from "./IEffectChangeInfo"

export interface IEffectsChangeInfo {
  PRE: IEffectChangeInfo[]
  WAH: IEffectChangeInfo[]
  DST: IEffectChangeInfo[]
  AMP: IEffectChangeInfo[]
  NR: IEffectChangeInfo[]
  CAB: IEffectChangeInfo[]
  EQ: IEffectChangeInfo[]
  MOD: IEffectChangeInfo[]
  DLY: IEffectChangeInfo[]
  RVB: IEffectChangeInfo[]
  VOL: IEffectChangeInfo[]
}