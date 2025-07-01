import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

import ActionButton from '@/components/gp/ActionButton';
import PresetBanner from '@/components/gp/PresetBanner';
import { ActionButtonType } from '@/components/gp/types';
import { MidiPlaygroundArea } from '@/components/MidiArea';
import { PatchChangeBaseSysEx, PatchChangeZeroSysEx } from '@/constants/SysExMsg';
import { MidiIoContext } from '@/contexts/MidiIoContext';
import { useContext, useEffect, useState } from 'react';


function getchangePresetSysEx(num: number) {
  let baseSysEx = PatchChangeBaseSysEx; 
  const high_byte = (num >> 4) & 0x0f;
  const low_byte = (num) & 0x0f;
  baseSysEx[25] = high_byte;
  baseSysEx[26] = low_byte; 

  return baseSysEx;
}


export default function HomeScreen() {

  const [presetNum, setPresetNum] = useState(0);
  
  const { inputPort, outputPort } = useContext(MidiIoContext);

  useEffect(()=>{
      console.log("Setting bank to 0");
      if (outputPort) {
        outputPort.send(PatchChangeZeroSysEx);
      }
  }, []);

  useEffect(()=>{
    console.log(inputPort);
    console.log(outputPort);
  }, [inputPort, outputPort]);


  useEffect(() => {
    console.log(presetNum);
      if (outputPort) {
        outputPort.send(getchangePresetSysEx(presetNum));
      }
  }, [presetNum]);

    const preset_plus = () => {
      let n = presetNum + 1;
      if (n > 255) {
        n = 0;
      }
      setPresetNum(n);
    }

    const preset_minus= () => {
      let n = presetNum - 1;
      if (n < 0) {
        n = 255;
      }
      setPresetNum(n);
    }
  


  return (
    <>
      <ThemedView style={styles.maincontainer}>
        <View style={styles.presetContainer}>
          <View style={styles.bannerContainer}>
            <PresetBanner presetName='Preset Name' presetNumber={presetNum}></PresetBanner>
          </View>
          <View style={styles.viewButtons}>
            <ActionButton title={"Patch -"} type={ActionButtonType.Patch} onPress={preset_minus}></ActionButton>
            <ActionButton title={"Patch +"} type={ActionButtonType.Patch} onPress={preset_plus}></ActionButton>
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
          <MidiPlaygroundArea/>
        </View>
      </ThemedView>
    </>
  );
}
          // <View style={styles.viewButtons}>
          // </View>

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