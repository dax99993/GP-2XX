import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, StyleSheet, Text, View } from "react-native";

import { MidiIoSetupContext } from '@/contexts/MidiIoSetupContext';
import { MIDIAccess } from "@motiz88/react-native-midi";


function getOutputDevice(access: MIDIAccess) {
    // Get GP-200 output
    for (const entry of access.outputs) {
        const output = entry[1];
        if (output.name.includes("GP-200")) {
            return output;
        }
    }

    return null;
}

export default function HomeScreen() {
    const router = useRouter();

  const {
    inputs,
    outputs,
    setCurrentInputId,
    currentInputId,
    setCurrentOutputId,
    currentOutputId,
  } = useContext(MidiIoSetupContext);


    const scan_for_devices = () => {
        console.log('scanning');
        console.log('inputs: ', inputs);
        console.log('outputs', outputs);
    }

    const connect_procedure = (id:string) => {
        console.log("id : ", id); 
        setCurrentInputId(id);
        setCurrentOutputId(id);
        router.replace('/ui/preset');
    };


    return (
        <View style={{flex: 1}}>
            <Text style={styles.text}>Connection screen</Text>
            <View style={{flex: 4}}>
                <Button title="Scan for devices" onPress={scan_for_devices}></Button>
                { inputs && outputs &&
                <View>
                    <Text style={styles.text}>Found Devices</Text>
                    <View style={{flexDirection: 'row', alignContent: 'space-between', justifyContent: 'space-between'}}>
                        { [...inputs.entries()].map(([key, input]) => (
                            <>
                            <Text style={styles.text}>{input.name}</Text>
                            <Button title="Connect" onPress={() => connect_procedure(key)}></Button>
                            </>
                        )) }
                    </View>
                </View>
                }
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 100}}>
            <Button title="About" onPress={() => {router.navigate('/about')}}></Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    text: {
        color: 'white',
        fontSize: 20,
    }
})