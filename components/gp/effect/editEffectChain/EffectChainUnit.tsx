import { Center } from "@/components/ui/center";
import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { StyleSheet, TouchableOpacity } from "react-native";
import EffectImage from "../EffectImage";

type EffectUnitProps = {
  chainID: number;
}

function EffectChainUnit(props: EffectUnitProps) {
  if (!store.gp200.currentPreset) {
    console.log("NULL current Preset");
    return null
  }

  const effect = store.gp200.currentPreset.effects[props.chainID];
  if (!effect) {
    console.log("No Effect with given id");
    return null
  }

  const select_unit = () => {
    store.changeShowPatchSettings(false);
    store.gp200.changeSelectedEffect(effect.type);
  }

    return (
      <TouchableOpacity onPress={select_unit} style={styles.baseContainer}>
        <Center className="bg-secondary-300 rounded-lg" style={styles.unitContainer}>
          <EffectImage 
            type={EffectType[effect.type]}
            state={effect.state}
            selected={store.gp200.currentEffect?.type == props.chainID}
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