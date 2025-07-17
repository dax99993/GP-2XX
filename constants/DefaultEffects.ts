import * as DefaultEffectsInfoJson from "@/json/Effects.json";
import { IEffectsInfo } from "@/models/effect/effectInfo";

export const DefaultEffectsInfo = DefaultEffectsInfoJson as IEffectsInfo;
//console.log("Default Effect Info", DefaultEffectsInfo);

// export const EffectNames = {
//     PRE: DefaultEffectsInfo.PRE.map(e => {e.name: e.name}),
//     WAH: DefaultEffectsInfo.WAH.map(e => e.name),
//     DST: DefaultEffectsInfo.DST.map(e => e.name),
// };