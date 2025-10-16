import SelectPresetList from '@/components/gp/preset/SelectPresetList';
import SelectPresetTopBar from '@/components/gp/preset/SelectPresetTopBar';
import { VStack } from '@/components/ui/vstack';
import { useKeepAwake } from 'expo-keep-awake';
import { Platform, StatusBar, StyleSheet } from 'react-native';


function SelectPresetScreen() {
  useKeepAwake();

  return (
    <>
        <VStack style={styles.mainContainer} className='bg-secondary-0'>
          <SelectPresetTopBar/>
          <SelectPresetList/>
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

export default SelectPresetScreen;