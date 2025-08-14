import { Platform, StatusBar, StyleSheet } from 'react-native';

import CtrlsSettings from '@/components/gp/presetSettings/ctrlSettings/CtrlsSettings';
import ExpsSettings from '@/components/gp/presetSettings/expSettings/ExpsSettings';
import FxLoopSettings from '@/components/gp/presetSettings/fxLoopSettings/FxLoopSettings';
import GeneralSettings from '@/components/gp/presetSettings/generalSettings/GeneralSettings';
import KnobsSettings from '@/components/gp/presetSettings/knobSettings/knobsSettings';
import { VStack } from '@/components/ui/vstack';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';



export default function PresetSettings() {

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <VStack space='md' className='bg-secondary-0'>
          <GeneralSettings/>
          <FxLoopSettings/>
          <KnobsSettings/>
          <CtrlsSettings/>
          <ExpsSettings/>
        </VStack>
      </ScrollView>
    </GestureHandlerRootView>
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