
import { Platform, StatusBar, StyleSheet } from 'react-native';

import { VStack } from '@/components/ui/vstack';

import { Button, ButtonText } from '@/components/ui/button';
import { store } from '@/models/store';
import React from 'react';


//export default GradientBackground;


export default function TestScreen() {

  return (
    <VStack style={styles.maincontainer} className='bg-secondary-0'>
      <Button size="xl" action='primary' onPress={()=> {store.modals.openModal("savePresetModal")}}>
        <ButtonText>Open Save Preset Modal</ButtonText>
      </Button>
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
});