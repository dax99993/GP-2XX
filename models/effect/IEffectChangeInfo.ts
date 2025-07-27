
export interface IEffectAssociated {
    name: string;
    id: number[];
    type: string;
}

export interface IEffectChangeInfo {
    name: string;
    id: number[];
    type: string;
    associated?: IEffectAssociated;
}