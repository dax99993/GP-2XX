
export interface ICtrlSettings {
    number: number; // Ctrl number in range [0-7]
    mode: number; // mode yellow = 0; red = 1
    pedalsAssign: number[]; // Pedals assign to turn on,
    // each element corresponds to an effect in the chainEffect, where the element index is chainID
    // value 0 is to not turn it on; value of 1 is to turn it on
}