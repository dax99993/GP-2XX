import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from "react-native";

import { store } from '@/models/store';
import { MIDIAccess } from "@motiz88/react-native-midi";
import { observer } from 'mobx-react-lite';



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


function HomeScreen() {
    const router = useRouter();

    const scan_for_devices = () => {
        console.log('scanning');
        store.gpmidi.midi.getMidiAccess();
        console.log('inputs: ', store.gpmidi.midi.inputs);
        console.log('outputs', store.gpmidi.midi.outputs);
    }

    const connect_procedure = (id:string) => {
        console.log("id: ", id); 
        store.gpmidi.midi.setInput(id);
        store.gpmidi.midi.setOutput(id);

        // Start listening to midi messages
        store.gpmidi.setupReceivedSysEx();
        router.replace('/ui/preset');
    };


    return (
        <View style={{flex: 1}}>
            <Text style={styles.text}>Connection screen</Text>
            <View style={{flex: 4}}>
                <Button title="Scan for devices" onPress={scan_for_devices}></Button>
                { store.gpmidi.midi.inputs && store.gpmidi.midi.inputs?.size != 0 && 
                  store.gpmidi.midi.outputs && store.gpmidi.midi.outputs?.size != 0 &&
                <View>
                    <Text style={styles.text}>Found Devices</Text>
                    <View style={{flexDirection: 'column', alignContent: 'space-between', justifyContent: 'space-between', marginBottom:20}}>
                        { [...store.gpmidi.midi.inputs.entries()].map(([key, input]) => (
                            <View style={{flexDirection: 'row'}}>
                            <Text style={styles.text}>{input.name}</Text>
                            <Button title="Connect" onPress={() => connect_procedure(key)}></Button>
                            </View>
                        )) }
                    </View>
                </View>
                }
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 100}}>
            <Button title="About" onPress={() => {router.navigate('/about')}}></Button>
            <Button title="Go to UI" onPress={() => {router.replace('/ui/preset')}}></Button>
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
        marginRight: 20,
    }
})

export default observer(HomeScreen);