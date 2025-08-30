export interface IChangeEffect {
    name: string;
    index: number;
    ID: number;
    description: string;
}

export interface IChangeEffects {
  PRE: IChangeEffect[]
  WAH: IChangeEffect[]
  DST: IChangeEffect[]
  AMP: IChangeEffect[]
  NR:  IChangeEffect[]
  CAB: IChangeEffect[]
  EQ:  IChangeEffect[]
  MOD: IChangeEffect[]
  DLY: IChangeEffect[]
  RVB: IChangeEffect[]
  VOL: IChangeEffect[]
}