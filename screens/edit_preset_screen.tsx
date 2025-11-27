import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import EffectChain from '@/components/gp/effect/chain/EffectChain';
import EffectEdit from '@/components/gp/effect/edit/EffectEdit';
import EditEffectTopBar from '@/components/gp/effect/edit/EffectEditTopBar';
import PresetSettings from '@/components/gp/presetSettings/PresetSettings';
import { VStack } from '@/components/ui/vstack';
import { ScrollingProvider } from '@/contexts/scroll-context';
import useOrientation from '@/hooks/useOrientation';
import { useStore } from '@/hooks/useStore';
import { useKeepAwake } from 'expo-keep-awake';
import { Orientation } from 'expo-screen-orientation';
import { observer } from 'mobx-react-lite';


export const EditPresetScreen = observer(() => {
  useKeepAwake();

  const store = useStore();
  const {orientation, isLandscape, isTablet} = useOrientation();
  console.log(Orientation[orientation]);

  return (
      <VStack space='md' className="bg-secondary-0" style={styles.mainContainer}>
        <EditEffectTopBar/>
        <View style={isLandscape ? styles.landscapeContainer : styles.portraitContainer} >
          <View style={{backgroundColor: ''}}>
          <EffectChain/>
          {/* Component to show only on tablet */}
          </View>
          <ScrollingProvider>
            <VStack style={{flex:1}}>
              {!store.showPatchSettings &&
                <EffectEdit />
              }
              {store.showPatchSettings &&
                <PresetSettings />
              }
            </VStack>
          </ScrollingProvider>
        </View>
      </VStack>
  );
})

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    //gap: 8,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  landscapeContainer: {
    flex:1,
    flexDirection: 'row',
    gap: 0,
  },
  portraitContainer: {
    flex:1,
    flexDirection: 'column',
    gap: 0,
  }
});