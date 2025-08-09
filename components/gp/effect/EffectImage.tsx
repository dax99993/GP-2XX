import { Image } from "react-native";

const unitONImages = {
    PRE: require("@/assets/images/effectUnits/chain_icon_PRE_on.png"),
    WAH: require("@/assets/images/effectUnits/chain_icon_WAH_on.png"),
    DST: require("@/assets/images/effectUnits/chain_icon_DST_on.png"),
    AMP: require("@/assets/images/effectUnits/chain_icon_AMP_on.png"),
    NR: require("@/assets/images/effectUnits/chain_icon_NR_on.png"),
    CAB: require("@/assets/images/effectUnits/chain_icon_CAB_on.png"),
    EQ: require("@/assets/images/effectUnits/chain_icon_EQ_on.png"),
    MOD: require("@/assets/images/effectUnits/chain_icon_MOD_on.png"),
    DLY: require("@/assets/images/effectUnits/chain_icon_DLY_on.png"),
    RVB: require("@/assets/images/effectUnits/chain_icon_RVB_on.png"),
    VOL: require("@/assets/images/effectUnits/chain_icon_VOL_on.png"),
}

const unitOFFImages = {
    PRE: require("@/assets/images/effectUnits/chain_icon_PRE_off.png"),
    WAH: require("@/assets/images/effectUnits/chain_icon_WAH_off.png"),
    DST: require("@/assets/images/effectUnits/chain_icon_DST_off.png"),
    AMP: require("@/assets/images/effectUnits/chain_icon_AMP_off.png"),
    NR: require("@/assets/images/effectUnits/chain_icon_NR_off.png"),
    CAB: require("@/assets/images/effectUnits/chain_icon_CAB_off.png"),
    EQ: require("@/assets/images/effectUnits/chain_icon_EQ_off.png"),
    MOD: require("@/assets/images/effectUnits/chain_icon_MOD_off.png"),
    DLY: require("@/assets/images/effectUnits/chain_icon_DLY_off.png"),
    RVB: require("@/assets/images/effectUnits/chain_icon_RVB_off.png"),
    VOL: require("@/assets/images/effectUnits/chain_icon_VOL_off.png"),
}

interface EffectImageProps {
    //chainID: number,
    type: string,
    state: boolean,
}

function EffectImage({type, state}: EffectImageProps) {

  const image = state ?
    unitONImages[type as keyof typeof unitONImages] :
    unitOFFImages[type as keyof typeof unitOFFImages];

    return (
            <Image source={image}
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
            />
    );
}

export default EffectImage;