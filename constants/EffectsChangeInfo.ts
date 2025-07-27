import EffectsChangesInfoJson from "@/json/EffectsChangeInfo.json";
import { IEffectsChangeInfo } from "@/models/effect/IEffectsChangeInfo";

export const EffectsChangeInfo = EffectsChangesInfoJson as IEffectsChangeInfo;
//console.log("Effects Change Info = ", EffectsChangeInfo);