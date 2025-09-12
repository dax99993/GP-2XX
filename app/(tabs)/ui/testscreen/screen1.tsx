
import { Platform, StatusBar, StyleSheet, View } from 'react-native';


import TopBar from '@/components/topBar/TopBar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import useOrientation from '@/hooks/useOrientation';
import { Orientation } from 'expo-screen-orientation';
import React from 'react';


import { Button, ButtonText } from '@/components/ui/button';

import { store } from '@/models/store';


export default function TestScreen() {
  const {orientation, isLandscape} = useOrientation();
  console.log(Orientation[orientation]);

  const onClick = async () => {
      const status = await store.presetImporter.LoadFiles();
      if (status) {
        const presetsInfo = store.presetImporter.decodeFiles();

        // Get memory positions to load presets
        // Open Modal with selection
        console.log("Open modal");
        store.modals.openModal("loadPresetsModal");

        // Load to GP200 memory
        presetsInfo.forEach(p => {
          console.log("\nPreset INFO: ", p);
        })
      }
  }

  return (
    <VStack space='xs' style={styles.maincontainer}>
      <TopBar>
        <TopBar.leftItems>
          <Text>Left</Text>
        </TopBar.leftItems>
        <TopBar.centerItems>
          <Text>TopBar</Text>
        </TopBar.centerItems>
        <TopBar.rightItems>
          <Text>Right</Text>
        </TopBar.rightItems>
      </TopBar>
      {/* <View style={isLandscape ? styles.landscapeContainer : styles.portraitContainer} > */}
      <View style={{flex:0 , backgroundColor: 'red'}} >
        <Button onPress={onClick}>
          <ButtonText>Load file</ButtonText>
        </Button>
        {/* <Button onPress={() => store.modals.openModal("savePresetModal")}> */}
        <Button onPress={() => store.modals.openModal("loadPresetsModal")}>
          <ButtonText>Open load presets modal</ButtonText>
        </Button>
      </View>
    </VStack>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    //flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: 'blue',
  },
  landscapeContainer: {
    flex:1,
    flexDirection: 'row', // Example: change layout direction in landscape
    // Add more landscape-specific styles here
    backgroundColor: 'white',
    gap: 5,
  },
  portraitContainer: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: 'red',
    gap: 5,
  }
});