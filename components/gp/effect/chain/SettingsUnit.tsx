import { Center } from "@/components/ui/center";
//import { observer } from "mobx-react-lite";
import { useStore } from "@/hooks/useStore";
import { observer } from "mobx-react-lite";
import { StyleSheet, TouchableOpacity } from "react-native";
import ChainUnitImage from "./ChainUnitImage";


function SettingsChainUnit({size}: {size: number}) {
  const store = useStore();

  const select_unit = () => {
    //store.gp200.changeSelectedEffect(effect.type);
    console.log("Show settings");
    store.changeShowPatchSettings(true);
  }

  const isSelected = store.showPatchSettings;

    return (
      <TouchableOpacity onPress={select_unit} style={styles.baseContainer}>
        <Center className="" style={{width: size, height: size}}>
            <ChainUnitImage
              type={"SET"}
              state={true}
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
  selected: {
    borderWidth: 3,
    borderColor: 'cyan',
  }
})


//export default SettingsChainUnit;
export default observer(SettingsChainUnit);