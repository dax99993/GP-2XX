
import { Platform, StatusBar, StyleSheet } from 'react-native';

import CtrlsSettings from '@/components/gp/presetSettings/ctrlSettings/CtrlsSettings';
import ExpSettings from '@/components/gp/presetSettings/expSettings/ExpSettings';
import FxLoopSettings from '@/components/gp/presetSettings/fxLoopSettings/FxLoopSettings';
import PresetSettings from '@/components/gp/presetSettings/generalSettings/PresetGeneralSettings';
import KnobsSettings from '@/components/gp/presetSettings/knobSettings/knobsSettings';
import { VStack } from '@/components/ui/vstack';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';




export default function TestScreen() {

  return (
    <VStack style={styles.maincontainer} className='bg-secondary-0'>
    <GestureHandlerRootView>
      <ScrollView>
        <VStack space='md'>
          <PresetSettings />
          <FxLoopSettings />
          <KnobsSettings/>
          <CtrlsSettings/>
          <ExpSettings/>
        </VStack>
      </ScrollView>
    </GestureHandlerRootView>
    </VStack>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    //marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    //backgroundColor: 'pink',
  },
  presetContainer: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'column',
  },
  controlContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'yellow',
  },
  bannerContainer: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  viewButtons: {
    flex: 2,
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //maxWidth: 500,
  }
});