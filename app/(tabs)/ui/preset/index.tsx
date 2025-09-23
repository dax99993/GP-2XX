import { Platform, StatusBar, StyleSheet } from 'react-native';


import { useEffect } from 'react';

import { VStack } from '@/components/ui/vstack';
import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';



function HomeScreen() {
  const store = useStore();
  useEffect(()=>{
    // Testing preset 63-D 251 number
    const preset_num = 0;
    // send action
    store.gpMidiEncoder.ChangePreset(preset_num);
    console.log("Setting bank to", store.gp200.presetBankCode);
  }, []);


  const incrementPreset = () => {
    store.gpMidiEncoder.NextPreset();
    console.log("Setting preset Num to", store.gp200.presetBankCode);
  }

  const decrementPreset = () => {
    store.gpMidiEncoder.PreviousPreset();
    console.log("Setting preset Num to", store.gp200.presetBankCode);
  }

  const incrementBank = () => {
    store.gpMidiEncoder.NextBank();
    console.log("Setting bank to", store.gp200.presetBankCode);
  }

  const decrementBank = () => {
    store.gpMidiEncoder.PrevBank();
    console.log("Setting bank to", store.gp200.presetBankCode);
  }
  const getPresetInfo = () => {
  }

  const logPreset = () => {
    console.log("Current preset", store.gp200.currentPreset);
  }

  return (
      <VStack className="bg-secondary-0" style={styles.maincontainer}>
      </VStack>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    //backgroundColor: 'pink',
  },
  bannerContainer: {
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  viewButtons: {
    backgroundColor: 'green',
    justifyContent: 'space-between',
  }
});

export default observer(HomeScreen);