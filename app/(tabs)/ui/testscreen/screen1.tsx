
import { Platform, StatusBar, StyleSheet, View } from 'react-native';


import ChainTest from '@/components/ChainTest';
import TopBar from '@/components/topBar/TopBar';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import useOrientation from '@/hooks/useOrientation';
import { store } from '@/models/store';
import { Orientation } from 'expo-screen-orientation';
import React from 'react';


export default function TestScreen() {
  const orientation = useOrientation();
  console.log(Orientation[orientation]);

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
      <View style={orientation === Orientation.LANDSCAPE_LEFT  || orientation === Orientation.LANDSCAPE_RIGHT 
          ? styles.landscapeContainer : styles.portraitContainer} >
          <ChainTest />
          <Button size="xl" action='primary' onPress={() => { store.modals.openModal("savePresetModal") }} style={{flex:1}}>
            <ButtonText>Open Save Preset Modal</ButtonText>
          </Button>
      </View>
      <Text style={{backgroundColor: 'gray'}}>Bottom Text</Text>
    </VStack>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    //marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: 'blue',
  },
  landscapeContainer: {
    flex:1,
    flexDirection: 'row', // Example: change layout direction in landscape
    // Add more landscape-specific styles here
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  portraitContainer: {
    flex:1,
    flexDirection: 'column', // Example: change layout direction in landscape
    justifyContent: 'space-around',
    alignItems: 'stretch',
    backgroundColor: 'red'
  }
});