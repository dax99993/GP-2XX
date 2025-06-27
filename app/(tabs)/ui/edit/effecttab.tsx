import { Platform, StatusBar, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

import EffectChain from '@/components/gp/EffectChain';


export default function HomeScreen() {

  return (
      <ThemedView style={styles.mainContainer}>
        <EffectChain></EffectChain>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  viewButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 500,
  }
});