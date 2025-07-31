import { IDefaultParameterInfo } from "./IParameterInfo"

export interface IDefaultEffectInfo {
  name: string
  id: number[]
  param_num: number
  params: IDefaultParameterInfo[]
  type: string
  description: string
}
