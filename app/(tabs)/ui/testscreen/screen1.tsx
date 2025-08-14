
import { Platform, StatusBar, StyleSheet } from 'react-native';

import { VStack } from '@/components/ui/vstack';

import GradientBackground, { Coloring } from '@/components/gp/effect/editEffectChain/GradientBackground';
import React from 'react';


//export default GradientBackground;


export default function TestScreen() {

  return (
    <VStack style={styles.maincontainer} className='bg-secondary-0'>
        <GradientBackground leftColoring={Coloring.Send} rightColoring={Coloring.Return}/>
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