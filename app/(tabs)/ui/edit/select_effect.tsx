import ListEffect from '@/components/gp/effect/listSelectEffect/ListEffect';
import ListEffectTopBar from '@/components/gp/effect/listSelectEffect/ListEffectTopBar';
import { VStack } from '@/components/ui/vstack';
import { Platform, StatusBar, StyleSheet } from 'react-native';


function SelectEffectScreen() {

  return (
    <>
        <VStack style={styles.mainContainer} className='bg-secondary-0'>
          <ListEffectTopBar/>
          <ListEffect />
        </VStack>
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

export default SelectEffectScreen;