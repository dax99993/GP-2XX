import { Button, Platform, StatusBar, StyleSheet, View } from 'react-native';



import EffectChain from '@/components/gp/effect/EffectChain';
import EffectEdit from '@/components/gp/effect/EffectEdit';
import TopBar from '@/components/topBar/TopBar';


export default function EditScreen() {

  return (
    <>
      <View style={styles.mainContainer}>
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
      </View>
    </>
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