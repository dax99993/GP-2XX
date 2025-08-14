import { Platform, StatusBar, StyleSheet, View } from 'react-native';


import EffectChain from '@/components/gp/effect/editEffectChain/EffectChain';
import EditEffectTopBar from '@/components/gp/effect/editEffectTopBar/TopBar';
import EffectEdit from '@/components/gp/effect/EffectEdit';
import PresetSettings from '@/components/gp/presetSettings/PresetSettings';
import { store } from '@/models/store';
import { observer } from 'mobx-react-lite';


function EditScreen() {

  return (
    <>
      <View style={styles.mainContainer}>
        <EditEffectTopBar/>
        <EffectChain/>
        {!store.showPatchSettings &&
          <EffectEdit/>
        }
        {store.showPatchSettings &&
          <PresetSettings/>
        }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    //gap: 8,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
});

export default observer(EditScreen)