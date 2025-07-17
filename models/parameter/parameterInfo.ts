export interface IParameterInfo {
  name: string
  type: string
  min_value: number[]
  max_value: number[]
  step_size: number[]
  default_value: number[]
  units: string
  labels: LabelsInfo
  numeric_type: string[]
  changes_param: string
}

export type LabelsInfo = Record<number, string>;