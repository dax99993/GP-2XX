import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import useOrientation from '@/hooks/useOrientation';
import { Orientation } from 'expo-screen-orientation';
import React from 'react';


import TopBar from '@/components/topBar/TopBar';
import { Button, ButtonText } from '@/components/ui/button';



export const TestScreen = () => {
  const {orientation, isLandscape} = useOrientation();
  console.log(Orientation[orientation]);

  const DATA = Array.from({ length: 50 }, (_, i) => i + 1);

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
      <Button>
        <ButtonText>Scroll</ButtonText>
      </Button>
      {/* <View style={isLandscape ? styles.landscapeContainer : styles.portraitContainer} > */}
      <View style={{flex:0 , backgroundColor: 'red', minWidth: 100, maxHeight: 250, justifyContent: 'center'}} >
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