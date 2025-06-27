import { StyleSheet, View } from "react-native";
import EffectUnit from "./EffecUnit";



function EffectChain() {
    return (
        <>
        <View style={styles.chainContainer}>
            <EffectUnit/>
            <EffectUnit/>
            <EffectUnit/>
            <EffectUnit/>
            <EffectUnit/>
            <EffectUnit/>
            <EffectUnit/>
            <EffectUnit/>
            <EffectUnit/>
            <EffectUnit/>
            <EffectUnit/>
        </View>
        </>
    )
} 

const styles = StyleSheet.create({
  chainContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginHorizontal: 20,
    //paddingVertical: 150,
  }
});

export default EffectChain;