export interface IDefaultParameterInfo {
  name: string
  type: string
  min_value: number[]
  max_value: number[]
  step_size: number[]
  default_value: number[]
  units: string
  labels: DefaultLabelsInfo
  numeric_type: string[]
  changes_param: string
  id: number
}

export type DefaultLabelsInfo = Record<number, string>;