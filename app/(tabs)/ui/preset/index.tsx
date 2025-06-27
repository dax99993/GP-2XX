import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

import ActionButton from '@/components/gp/ActionButton';
import PresetBanner from '@/components/gp/PresetBanner';
import { ActionButtonType } from '@/components/gp/types';
import { EffectUnitSysEx } from '@/constants/SysExMsg';



export default function HomeScreen() {

  /*
    const gpmidi = useGPContext();

    useEffect(()=>{
      console.log("Connected output!");
      console.log(gpmidi);
    }, [gpmidi]);
  */


    const change_preset_plus = () => {
        const message = EffectUnitSysEx.enablePre;
        //gpmidi.sendMessage(message);
    }

    const change_preset_minus= () => {
        const message = EffectUnitSysEx.disablePre;
        //gpmidi.sendMessage(message);
    }
  


  return (
    <>
      <ThemedView style={styles.maincontainer}>
        <View style={styles.presetContainer}>
          <View style={styles.bannerContainer}>
            <PresetBanner></PresetBanner>
          </View>
          <View style={styles.viewButtons}>
            <ActionButton title={"Patch -"} type={ActionButtonType.Patch} onPress={change_preset_minus}></ActionButton>
            <ActionButton title={"Patch +"} type={ActionButtonType.Patch} onPress={change_preset_plus}></ActionButton>
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
        <View style={styles.controlContainer}></View>
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