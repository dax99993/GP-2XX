import { Center } from "@/components/ui/center";
import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { StyleSheet, TouchableOpacity } from "react-native";
import EffectImage from "../EffectImage";

type EffectUnitProps = {
  chainID: number;
  size: number;
}

function EffectChainUnit(props: EffectUnitProps) {
  // if (!store.gp200.currentPreset) {
  //   console.log("NULL current Preset");
  //   return null
  // }

  const effectType = store.gp200.currentPreset ? 
    store.gp200.currentPreset.effects[props.chainID].type :
    props.chainID as EffectType;

  const effectState = store.gp200.currentPreset ?
    store.gp200.currentPreset.effects[props.chainID].state :
    false;

  //const isSelected = store.gp200.currentEffect?.type == props.chainID && !store.showPatchSettings
  const isSelected = store.gp200.currentEffect ? 
    store.gp200.currentEffect.type == props.chainID && !store.showPatchSettings :
    false;

  const select_unit = () => {
    store.changeShowPatchSettings(false);
    store.gp200.changeSelectedEffect(effectType);
  }

    return (
      <TouchableOpacity onPress={select_unit} style={styles.baseContainer}>
        <Center className="" style={{width: props.size, height: props.size}}>
            <EffectImage
              type={EffectType[effectType]}
              state={effectState}
              selected={isSelected}
            />
        </Center>
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  baseContainer: {
    alignItems: 'center',
  },
})


export default observer(EffectChainUnit);