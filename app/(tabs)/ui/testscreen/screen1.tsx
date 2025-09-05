
import { Platform, StatusBar, StyleSheet, View } from 'react-native';


import TopBar from '@/components/topBar/TopBar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import useOrientation from '@/hooks/useOrientation';
import { Orientation } from 'expo-screen-orientation';
import React from 'react';


import { Button, ButtonText } from '@/components/ui/button';

import { decodePRSTFile } from '@/models/preset/presetFile';
import { Buffer } from "buffer";
import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync } from "expo-file-system";


export default function TestScreen() {
  const {orientation, isLandscape} = useOrientation();
  console.log(Orientation[orientation]);

  const onClick = async () => {
    const documents = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type:"application/octet-stream"
    });

    if (!documents.canceled) {
      console.log(documents.assets);
      for (let i = 0; i < documents.assets.length; i=i+1) {
        const asset = documents.assets[i];
        console.log("Asset", i, asset);
        // Read file
        const s = await readAsStringAsync(asset.uri, {encoding: 'base64'});
        console.log(s);
        // Convert to uint8array
        const buffer = Buffer.from(s, 'base64');
        console.log("Buffer", buffer);

        const presetInfo = decodePRSTFile(buffer);
        console.log(presetInfo);

      }

      // Evoke action on presets
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
      </View>
    </VStack>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
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