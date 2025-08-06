import { Center } from "@/components/ui/center";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

// type EffectUnitProps = {
//     title: string;
//     type: EffectType;
//     state: boolean;
// }

type EffectUnitProps = {
  chainID: number;
}

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




function EffectChainUnit(props:EffectUnitProps) {
  if (!store.gp200.currentPreset) {
    console.log("NULL current Preset");
    return null
  }

  const effect = store.gp200.currentPreset.effects[props.chainID];
  if (!effect) {
    console.log("No Effect with given id");
    return null
  }

  const image = effect.state ?
    unitONImages[effect.typeName as keyof typeof unitONImages] :
    unitOFFImages[effect.typeName as keyof typeof unitOFFImages];
  
  // Maybe add contour to selected effect

  const select_unit = () => {
    store.gp200.changeSelectedEffect(effect.type);
  }

    return (
      <TouchableOpacity onPress={select_unit} style={styles.baseContainer}>
        <Center className="bg-secondary-300 rounded-lg" style={styles.unitContainer}>
            <Image source={image}
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
            />
        </Center>
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  baseContainer: {
    alignItems: 'center',
  },
  unitContainer: {
    height: 70,
    width: 70,
  },
})


export default observer(EffectChainUnit);