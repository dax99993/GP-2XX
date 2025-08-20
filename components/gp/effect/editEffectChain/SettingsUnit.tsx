import { Center } from "@/components/ui/center";
import { store } from "@/models/store";
//import { observer } from "mobx-react-lite";
import { Text } from "@/components/ui/text";
import { observer } from "mobx-react-lite";
import { StyleSheet, TouchableOpacity } from "react-native";


function SettingsChainUnit({size}: {size: number}) {
  // if (!store.gp200.currentPreset) {
  //   console.log("NULL current Preset");
  //   return null;
  // }

  const select_unit = () => {
    //store.gp200.changeSelectedEffect(effect.type);
    console.log("Show settings");
    store.changeShowPatchSettings(true);
  }

  const isSelected = store.showPatchSettings;

    return (
      <TouchableOpacity onPress={select_unit} style={styles.baseContainer}>
        <Center className="bg-secondary-300 rounded-lg" style={[{width: size, height:size}, isSelected ? styles.selected : {}]}>
            <Text size="xs">Preset</Text>
            <Text size="xs">Settings</Text>
        </Center>
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  baseContainer: {
    alignItems: 'center',
  },
  selected: {
    borderWidth: 3,
    borderColor: 'cyan',
  }
})


//export default SettingsChainUnit;
export default observer(SettingsChainUnit);