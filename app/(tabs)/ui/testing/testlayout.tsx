
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { useState } from 'react';




export default function TestScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <View style={styles.maincontainer}>
        <Button onPress={() => setIsModalOpen(!isModalOpen)}> 
          <ButtonText>Open Modal</ButtonText>
        </Button>
        <View style={styles.presetContainer}>
          <View style={styles.bannerContainer}></View>
          <View style={styles.viewButtons}></View>
          <View style={[styles.viewButtons, {backgroundColor: 'lightgreen'}]}>
          </View>
        </View>
        <View style={styles.controlContainer}></View>
      </View>
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