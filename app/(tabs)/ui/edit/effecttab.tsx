import { Button, Platform, StatusBar, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';


import EffectChain from '@/components/gp/effect/EffectChain';
import EffectEdit from '@/components/gp/effect/EffectEdit';
import TopBar from '@/components/topBar/TopBar';


export default function EditScreen() {

  return (
      <ThemedView style={styles.mainContainer}>
        <TopBar
        left={<TopBar.leftItems>
          {
          <Button title="Asd"></Button>
          }
        </TopBar.leftItems>}
        right={<TopBar.rightItems>
          {
            <>
          <Button title="right1"></Button>
          <Button title="Right2"></Button>
            </>
          }
        </TopBar.rightItems>}
      />
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