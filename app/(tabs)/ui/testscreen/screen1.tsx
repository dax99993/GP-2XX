
import { Platform, StatusBar, StyleSheet, View } from 'react-native';


import ChainTest from '@/components/ChainTest';
import NumericSlider from '@/components/NumericSlider';
import TopBar from '@/components/topBar/TopBar';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import useOrientation from '@/hooks/useOrientation';
import { store } from '@/models/store';
import { Orientation } from 'expo-screen-orientation';
import React from 'react';


export default function TestScreen() {
  const {orientation, isLandscape} = useOrientation();
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
      <View style={isLandscape ? styles.landscapeContainer : styles.portraitContainer} >
          <ChainTest />
          <VStack style={{flex:1}}>
            <Button size="xl" action='primary' onPress={() => { store.modals.openModal("savePresetModal") }}>
              <ButtonText>Open Save Preset Modal</ButtonText>
            </Button>
            <NumericSlider name={"Slider"} minValue={0} maxValue={100} step={1} currentValue={50}
              onChange={function (n: number): void {
              }} />
          </VStack>
      </View>
      <Text style={{backgroundColor: 'gray'}}>Bottom Text</Text>
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