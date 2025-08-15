import { Platform, StatusBar, StyleSheet } from 'react-native';


import ActionButton from '@/components/gp/ActionButton';
import PresetBanner from '@/components/gp/PresetBanner';
import { ActionButtonType } from '@/components/gp/types';
import { useEffect } from 'react';

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { store } from '@/models/store';
import { observer } from 'mobx-react-lite';



function HomeScreen() {

  useEffect(()=>{
    // Testing preset 63-D 251 number
    const preset_num = 0;
    // send action
    store.gpActions.ChangePreset(preset_num);
    console.log("Setting bank to", store.gp200.presetBankCode);
  }, []);


  const incrementPreset = () => {
    store.gpActions.NextPreset();
    console.log("Setting preset Num to", store.gp200.presetBankCode);
  }

  const decrementPreset = () => {
    store.gpActions.PreviousPreset();
    console.log("Setting preset Num to", store.gp200.presetBankCode);
  }

  const incrementBank = () => {
    store.gpActions.NextBank();
    console.log("Setting bank to", store.gp200.presetBankCode);
  }

  const decrementBank = () => {
    store.gpActions.PrevBank();
    console.log("Setting bank to", store.gp200.presetBankCode);
  }
  const getPresetInfo = () => {
  }

  const logPreset = () => {
    console.log("Current preset", store.gp200.currentPreset);
  }

  return (
      <VStack className="bg-secondary-0" style={styles.maincontainer}>
          <PresetBanner presetName={store.gp200.currentPreset?.name ?? ""} presetBankCode={store.gp200.presetBankCode}></PresetBanner>
          <HStack style={styles.viewButtons}>
            <ActionButton
              title={"Preset -"}
              type={ActionButtonType.Patch}
              onPress={decrementPreset}
            />
            <ActionButton
              title={"Preset +"}
              type={ActionButtonType.Patch}
              onPress={incrementPreset}
            />
            <ActionButton
              title={"Bank -"}
              type={ActionButtonType.Patch}
              onPress={decrementBank}
            />
            <ActionButton
              title={"Bank +"}
              type={ActionButtonType.Patch}
              onPress={incrementBank}
            />
            {/* <ActionButton title={"Bank"} type={ActionButtonType.ControlOn} onPress={() => { }}></ActionButton>
            <ActionButton title={"Tap"} type={ActionButtonType.Tap} onPress={() => { }}></ActionButton> */}
          </HStack>
          {/* <View style={styles.viewButtons}>
             <ActionButton title={"Ctrl 1"} type={ActionButtonType.ControlOff} onPress={getPresetInfo}></ActionButton>
             <ActionButton title={"Ctrl 2"} type={ActionButtonType.ControlOff} onPress={logPreset}></ActionButton>
             <ActionButton title={"Ctrl 3"} type={ActionButtonType.ControlOff} onPress={() => { }}></ActionButton>
             <ActionButton title={"Ctrl 4"} type={ActionButtonType.ControlOff} onPress={() => { }}></ActionButton>
          </View> */}
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