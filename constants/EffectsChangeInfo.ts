import EffectsChangesInfoJson from "@/json/EffectsChangeInfo.json";
import { IEffectsChangeInfo } from "@/models/effect/changeEffect/IEffectsChangeInfo";

export const EffectsChangeInfo = EffectsChangesInfoJson as IEffectsChangeInfo;
//console.log("Effects Change Info = ", EffectsChangeInfo);