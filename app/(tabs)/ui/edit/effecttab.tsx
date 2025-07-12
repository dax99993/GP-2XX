import { Platform, StatusBar, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';


import EffectChain from '@/components/gp/EffectChain';
import EffectEdit from '@/components/gp/EffectEdit';


export default function EditScreen() {

  return (
      <ThemedView style={styles.mainContainer}>
        <EffectChain/>
        <EffectEdit/>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    //gap: 8,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
});