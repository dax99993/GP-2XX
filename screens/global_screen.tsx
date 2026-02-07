import { Platform, StatusBar, StyleSheet } from 'react-native';

import GlobalSettings from '@/components/gp/globalSettings/GlobalSettings';
import { VStack } from '@/components/ui/vstack';
import { ScrollingProvider } from '@/contexts/scroll-context';
import useOrientation from '@/hooks/useOrientation';
import { Orientation } from 'expo-screen-orientation';
import React from 'react';

export const GlobalSettingsScreen = () => {
  const {orientation, isLandscape} = useOrientation();
  console.log(Orientation[orientation]);

  return (
    <VStack space='xs' style={styles.maincontainer}>
      <ScrollingProvider>
        <GlobalSettings/>
      </ScrollingProvider>
    </VStack>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
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