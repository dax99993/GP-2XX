
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import SelectEffect from '@/components/gp/effect/SelectEffect';




export default function TestScreen() {

  return (
    <>
      <ThemedView style={styles.maincontainer}>
        <View style={[styles.viewButtons, {backgroundColor: 'lightgreen'}]}>
            <SelectEffect data={["a"]}/>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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