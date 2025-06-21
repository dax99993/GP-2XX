import { Image } from 'expo-image';
import { Button, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import ActionButton from '@/components/gp/ActionButton';
import ParameterBox from '@/components/gp/ParameterBox';
import PresetBanner from '@/components/gp/PresetBanner';
import { ActionButtonType } from '@/components/gp/types';
import { EffectUnitSysEx } from '@/constants/SysExMsg';
import { MIDIInput, MIDIOutput, requestMIDIAccess } from "@motiz88/react-native-midi";
import { useEffect, useState } from 'react';



export default function HomeScreen() {

    const [midiDevices, setMidiDevices] = useState("")
    const [midiInput, setMidiInput] = useState<MIDIInput | null>(null);
    const [midiOutput, setMidiOutput] = useState<MIDIOutput | null>(null);
    
    useEffect(()=>{
        console.log("Connected output!");
        console.log(midiOutput);
    }, [midiOutput]);

    const sendSysEx = () => {
        if (midiOutput) {
            const message = new Uint8Array([
                0xf0, 0x21, 0x25, 0x7e, 0x47, 0x50, 0x2d, 0x32,
                0x12, 0x08, 0x00, 0x00, 0x00, 0x00, 0x08, 0x01,
                0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x05, 0x0f, 0x00, 0x00, 0xf7
                ]);

            midiOutput.send(message);
            console.log("message sent.");
        }
    };

    const change_preset_plus = () => {
        const message = EffectUnitSysEx.enablePre;
        midiOutput?.send(message);
    }

    const change_preset_minus= () => {
        const message = EffectUnitSysEx.disablePre;
        midiOutput?.send(message);
    }

  const buttonAction = () => {
    requestMIDIAccess({software: false, sysex: true}).then((midiAccess) => {
      console.log("Request midi access");
      // Use midiAccess.inputs and midiAccess.outputs
      console.log(midiAccess);
      console.log(midiAccess.inputs);
      console.log(midiAccess.outputs);

      // Get GP-200
      for (const entry of midiAccess.inputs) {
        const input = entry[1];
        if (input.name.includes("GP-200") ) {
            setMidiInput(input);
        }
      }

      for (const entry of midiAccess.outputs) {
        const output = entry[1];
        if (output.name.includes("GP-200") ) {
            setMidiOutput(output);
        }
      }

    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Request access</ThemedText>
        <Button onPress={buttonAction} title="Access MIDI"></Button>
        <Button onPress={sendSysEx} title="Send SysEx MIDI"></Button>
        <ThemedText type="subtitle">test components</ThemedText>
        <PresetBanner></PresetBanner>
        <View style={styles.viewButtons}>
            <ActionButton title={"Patch -"} type={ActionButtonType.Patch} onPress={change_preset_minus}></ActionButton>
            <ActionButton title={"Patch +"} type={ActionButtonType.Patch} onPress={change_preset_plus}></ActionButton>
            <ActionButton title={"Bank"} type={ActionButtonType.ControlOn} onPress={()=>{}}></ActionButton>
            <ActionButton title={"Tap"} type={ActionButtonType.Tap} onPress={()=>{}}></ActionButton>
        </View>
        <View style={styles.viewButtons}>
            <ActionButton title={"Ctrl 1"} type={ActionButtonType.ControlOff} onPress={()=>{}}></ActionButton>
            <ActionButton title={"Ctrl 2"} type={ActionButtonType.ControlOff} onPress={()=>{}}></ActionButton>
            <ActionButton title={"Ctrl 3"} type={ActionButtonType.ControlOff} onPress={()=>{}}></ActionButton>
            <ActionButton title={"Ctrl 4"} type={ActionButtonType.ControlOff} onPress={()=>{}}></ActionButton>
        </View>
        <View style={styles.viewButtons}>     
            <ParameterBox/>
            <ParameterBox/>
            <ParameterBox/>
        </View>
</ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  viewButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 500,
  }
});