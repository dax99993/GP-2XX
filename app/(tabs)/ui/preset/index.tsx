import { Platform, StatusBar, StyleSheet, View } from 'react-native';


import ActionButton from '@/components/gp/ActionButton';
import PresetBanner from '@/components/gp/PresetBanner';
import { ActionButtonType } from '@/components/gp/types';
import { useEffect } from 'react';

import { store } from '@/models/store';
import { observer } from 'mobx-react-lite';



function HomeScreen() {

  useEffect(()=>{
    // Testing preset 63-D 251 number
    const preset_num = 1
    // send action
    store.gpActions.ChangePreset(preset_num);
    console.log("Setting bank to", store.gp200.presetBankCode);
  }, []);

  const increment = () => {
    store.gpActions.NextPreset();
    console.log("Setting bank to", store.gp200.presetBankCode);
  }

  const decrement = () => {
    store.gpActions.PreviousPreset();
    console.log("Setting bank to", store.gp200.presetBankCode);
  }

  const getPresetInfo = () => {
  }

  const logPreset = () => {
    console.log("Current preset", store.gp200.currentPreset);
  }

  return (
    <>
      <View style={styles.maincontainer}>
        <View style={styles.presetContainer}>
          <View style={styles.bannerContainer}>
            <PresetBanner presetName={store.gp200.currentPreset?.name ?? ""} presetBankCode={store.gp200.presetBankCode}></PresetBanner>
          </View>
          <View style={styles.viewButtons}>
            <ActionButton title={"Patch -"} type={ActionButtonType.Patch} onPress={decrement}></ActionButton>
            <ActionButton title={"Patch +"} type={ActionButtonType.Patch} onPress={increment}></ActionButton>
            <ActionButton title={"Bank"} type={ActionButtonType.ControlOn} onPress={() => { }}></ActionButton>
            <ActionButton title={"Tap"} type={ActionButtonType.Tap} onPress={() => { }}></ActionButton>
          </View>
          <View style={styles.viewButtons}>
             <ActionButton title={"Ctrl 1"} type={ActionButtonType.ControlOff} onPress={getPresetInfo}></ActionButton>
             <ActionButton title={"Ctrl 2"} type={ActionButtonType.ControlOff} onPress={logPreset}></ActionButton>
             <ActionButton title={"Ctrl 3"} type={ActionButtonType.ControlOff} onPress={() => { }}></ActionButton>
             <ActionButton title={"Ctrl 4"} type={ActionButtonType.ControlOff} onPress={() => { }}></ActionButton>
          </View>
        </View>
        <View style={styles.controlContainer}>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: 'pink',
  },
  presetContainer: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'column',
  },
  controlContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'orange',
  },
  bannerContainer: {
    flex: 2,
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  viewButtons: {
    flex: 3,
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //maxWidth: 500,
  }
});

export default observer(HomeScreen);