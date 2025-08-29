

export interface IKnob {
    _Name: string;
    // Position in parameter list
    _idx: number;
    // ID of parameter in GP
    _ID: number;
    _default: number;
    _Dmin: number;
    _Dmax: number;
    // Fixed in 1
    _Type: number;
    _step: number;

    _Suffix?: string;
    _bind?: number;
    // 1 or 2 Differentiate among 
    _valueType?: number;
    // either 1 or undefined
    _MinISOff?: number;

}

export interface ISlider {
    _Name: string;
    _idx: number;
    _ID: number;
    _default: number;
    _Dmin: number,
    _Dmax: number,
    // Fixed in 1
    _Type: number,
    _step: number,
}

export interface ISwitch {
    _Name: string;
    _default: number;
    _idx: number,
    _ID: number,
    // Fixed in 3
    _Type: number;
    // Fixed in Power
    _SubType: string;
    // What value it is being bind to
    _bind?: number;
}

export interface ICombBox {
    _Name: string;
    _idx: number;
    _ID: number;
    _default: number;
    // Fixed in 2
    _Type: number;
}