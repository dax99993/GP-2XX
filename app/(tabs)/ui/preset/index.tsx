import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

import ActionButton from '@/components/gp/ActionButton';
import PresetBanner from '@/components/gp/PresetBanner';
import { ActionButtonType } from '@/components/gp/types';
import { MidiIoContext } from '@/contexts/MidiIoContext';
import { useContext, useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { gp200 } from '@/models/gp200';


function HomeScreen() {

  const { inputPort, outputPort } = useContext(MidiIoContext);

  useEffect(()=>{
      console.log("Setting bank to 0");
      if (outputPort && inputPort) {
        gp200.setInput(inputPort);
        gp200.setOutput(outputPort);

        gp200.changePreset(0);
      }
  }, []);

  const increment = () => {
    gp200.incrementPresetNum();
  }

  const decrement = () => {
    gp200.decrementPresetNum();
  }

  return (
    <>
      <ThemedView style={styles.maincontainer}>
        <View style={styles.presetContainer}>
          <View style={styles.bannerContainer}>
            <PresetBanner presetName='Preset Name' presetNumber={gp200.current_preset_number}></PresetBanner>
          </View>
          <View style={styles.viewButtons}>
            <ActionButton title={"Patch -"} type={ActionButtonType.Patch} onPress={decrement}></ActionButton>
            <ActionButton title={"Patch +"} type={ActionButtonType.Patch} onPress={increment}></ActionButton>
            <ActionButton title={"Bank"} type={ActionButtonType.ControlOn} onPress={() => { }}></ActionButton>
            <ActionButton title={"Tap"} type={ActionButtonType.Tap} onPress={() => { }}></ActionButton>
          </View>
          <View style={styles.viewButtons}>
             <ActionButton title={"Ctrl 1"} type={ActionButtonType.ControlOff} onPress={() => { }}></ActionButton>
             <ActionButton title={"Ctrl 2"} type={ActionButtonType.ControlOff} onPress={() => { }}></ActionButton>
             <ActionButton title={"Ctrl 3"} type={ActionButtonType.ControlOff} onPress={() => { }}></ActionButton>
             <ActionButton title={"Ctrl 4"} type={ActionButtonType.ControlOff} onPress={() => { }}></ActionButton>
          </View>
        </View>
        <View style={styles.controlContainer}>
        </View>
      </ThemedView>
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