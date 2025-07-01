import { StyleSheet, Text, View } from "react-native";


enum EffectType {
    PRE = "pre",
    WAH = "wah",
    DST = "dst",
}

type EffectUnitProps = {
    effecttype: string;
    //effecttype: EffectType;
    title: string;
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


    const style = getStyle(props.effecttype.toString());

    return (
        <View style={[styles.baseContainer, style]}>
           <Text style={styles.text}>{props.title}</Text>
        </View>
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
    backgroundColor: 'yellow',
  },
  dstContainer: {
    backgroundColor: 'red',
  },
  text: {
    color: '#fff',
  }
})


export default EffectUnit;