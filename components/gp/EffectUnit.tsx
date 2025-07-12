import { gp200 } from "@/models/gp200";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type EffectUnitProps = {
    //effect: Effect;
    title: string;
    type: string;
}

function getStyle(effecttype: string) {
  let style;
  switch (effecttype) {
    case "pre":
      style = styles.preContainer;
      break;
    case "wah":
      style = styles.wahContainer;
      break;
    case "dst":
      style = styles.dstContainer;
      break;
    default:
      style = styles.preContainer;
      break;
    }

    return style;
}


function EffectUnit(props:EffectUnitProps) {


    const style = getStyle(props.type.toString());

    const select_unit = () => {
      console.log("You select ", props.title);
      gp200.changeSelectedEffect(props.title);
    }

    return (
      <TouchableOpacity onPress={select_unit}>
        <View style={[styles.baseContainer, style]}>
          <Text style={styles.text}>{props.title}</Text>
        </View>
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 10,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  preContainer: {
    backgroundColor: 'lightblue',
  },
  wahContainer: {
    backgroundColor: 'lightgreen',
  },
  dstContainer: {
    backgroundColor: 'orange',
  },
  text: {
    color: '#fff',
  }
})


export default EffectUnit;