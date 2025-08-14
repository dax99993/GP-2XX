import { Center } from "@/components/ui/center";
import { store } from "@/models/store";
//import { observer } from "mobx-react-lite";
import { Text } from "@/components/ui/text";
import { StyleSheet, TouchableOpacity } from "react-native";


function SettingsChainUnit() {
  if (!store.gp200.currentPreset) {
    console.log("NULL current Preset");
    return null;
  }


  const select_unit = () => {
    //store.gp200.changeSelectedEffect(effect.type);
    console.log("Show settings");
    store.changeShowPatchSettings(true);
  }

    return (
      <TouchableOpacity onPress={select_unit} style={styles.baseContainer}>
        <Center className="bg-secondary-300 rounded-lg" style={styles.unitContainer}>
            <Text>Patch</Text>
            <Text>Settings</Text>
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


//export default observer(EffectChainUnit);
export default SettingsChainUnit;