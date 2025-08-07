
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import FxLoopSettings from '@/components/gp/effectSettings/fxLoopAssignment/FxLoopSettings';
import KnobAssign from '@/components/gp/effectSettings/knobAssignment/knobAsign';
import { VStack } from '@/components/ui/vstack';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';




export default function TestScreen() {

  return (
    <View style={styles.maincontainer}>
    <GestureHandlerRootView>
      <ScrollView>
        <VStack space='md'>
          <FxLoopSettings />
          <KnobAssign />
        </VStack>
      </ScrollView>
    </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    //marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: 'pink',
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