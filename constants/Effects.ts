import ChangeEffectsJson from "@/json/ChangeEffects.json";
import DefaultEffectsJson from "@/json/DefaultEffects.json";
import { IChangeEffects } from "@/models/effect/changeEffect/IChangeEffects";
import { IEffectsCatalog } from "@/models/effect/defaultEffect/IDefaultEffects";

export const EffectsCatalog = DefaultEffectsJson as IEffectsCatalog[];
export const EffectsInfo = ChangeEffectsJson as IChangeEffects;
