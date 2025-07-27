import { IParameterInfo } from "../parameter/IParameterInfo"

export interface IEffectInfo {
  name: string
  id: number[]
  param_num: number
  params: IParameterInfo[]
  type: string
  description: string
}
