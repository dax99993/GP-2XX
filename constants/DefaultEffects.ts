import DefaultEffectsJson from "@/json/DefaultEffects.json";
import {
    IEffectsCatalog
} from "@/models/effect/defaultEffect/IDefaultEffects";

// export const DefaultEffectsInfo = DefaultEffectsJson as IDefaultEffects;
export const EffectsCatalog = DefaultEffectsJson as IEffectsCatalog[];
