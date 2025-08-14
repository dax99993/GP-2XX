import { Center } from "@/components/ui/center";
import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { StyleSheet, TouchableOpacity } from "react-native";
import EffectImage from "../EffectImage";
import GradientBackground, { Coloring } from "./GradientBackground";

type EffectUnitProps = {
  chainID: number;
}

function getColors(pos: number, sendPos:number, returnPos: number) {
  let leftColor;
  let rightColor;
  if (pos == sendPos && pos == returnPos) {
    leftColor = Coloring.SendReturn
  } else if(pos == sendPos) {
    leftColor = Coloring.Send
  } else if(pos == returnPos) {
    leftColor = Coloring.Return
  } else {
    leftColor = Coloring.None
  }

  if (pos == sendPos - 1 && pos == returnPos - 1) {
    rightColor = Coloring.SendReturn
  } else if(pos == sendPos - 1) {
    rightColor = Coloring.Send
  } else if(pos == returnPos - 1) {
    rightColor = Coloring.Return
  } else {
    rightColor = Coloring.None
  }

  return [leftColor, rightColor];
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

  // Get correct coloring
  const sendPos = store.gp200.currentPreset.fxLoop.sendPosition;
  const returnPos = store.gp200.currentPreset.fxLoop.returnPosition;
  const pos = store.gp200.currentPreset.effectsChainOrder.indexOf(props.chainID);
  const [leftColor, rightColor] = getColors(pos, sendPos, returnPos);

    return (
      <TouchableOpacity onPress={select_unit} style={styles.baseContainer}>
        <Center className="bg-secondary-300 rounded-lg" style={styles.unitContainer}>
          <GradientBackground
            leftColoring={leftColor}
            rightColoring={rightColor}
          >
            <EffectImage
              type={EffectType[effect.type]}
              state={effect.state}
              //selected={store.gp200.currentEffect?.type == props.chainID}
              selected={store.gp200.currentEffect?.type == props.chainID && !store.showPatchSettings}
            />
          </GradientBackground>
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