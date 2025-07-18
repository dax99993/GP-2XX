import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type EffectUnitProps = {
    title: string;
    type: EffectType;
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
      store.gp200.changeSelectedEffect(props.type);
    }

    return (
      <TouchableOpacity onPress={select_unit}>
        <View style={[styles.baseContainer, style]}>
          <View style={styles.unitContainer}>
            <Text style={styles.text}>{props.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 5,
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'lightblue',
    borderWidth: 5,
  },
  unitContainer: {
    height: 70,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  preContainer: {
    //backgroundColor: 'lightblue',
    width: '100%',
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