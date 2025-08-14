import { Platform, StatusBar, StyleSheet } from 'react-native';


import EffectChain from '@/components/gp/effect/editEffectChain/EffectChain';
import EditEffectTopBar from '@/components/gp/effect/editEffectTopBar/TopBar';
import EffectEdit from '@/components/gp/effect/EffectEdit';
import PresetSettings from '@/components/gp/presetSettings/PresetSettings';
import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { store } from '@/models/store';
import { observer } from 'mobx-react-lite';


function EditScreen() {

  return (
      <VStack space='md' className="bg-secondary-0" style={styles.mainContainer}>
        <EditEffectTopBar/>
        <EffectChain/>
        <Divider/>
        {!store.showPatchSettings &&
          <EffectEdit/>
        }
        {store.showPatchSettings &&
          <PresetSettings/>
        }
      </VStack>
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