import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";

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
                <Button size="md" variant="solid" action="primary" onPress={scan_for_devices}>
                    <ButtonText>Scan for devices</ButtonText>
                </Button>
                { store.gpmidi.midi.inputs && store.gpmidi.midi.inputs?.size != 0 && 
                  store.gpmidi.midi.outputs && store.gpmidi.midi.outputs?.size != 0 &&
                <View>
                    <Text style={styles.text}>Found Devices</Text>
                    <View style={{flexDirection: 'column', alignContent: 'space-between', justifyContent: 'space-between', marginBottom:20}}>
                        { [...store.gpmidi.midi.inputs.entries()].map(([key, input]) => (
                            <View style={{flexDirection: 'row'}}>
                            <Text style={styles.text}>{input.name}</Text>
                            <Button size="md" variant="solid" action="primary" onPress={() => connect_procedure(key)}>
                                <ButtonText>Connect</ButtonText>
                            </Button>
                            </View>
                        )) }
                    </View>
                </View>
                }
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 100}}>
                <Button size="md" variant="solid" action="primary" onPress={() => {router.navigate('/about')}}>
                    <ButtonText>About</ButtonText>
                </Button>
                <Button size="md" variant="solid" action="primary" onPress={() => {router.replace('/ui/preset')}}>
                    <ButtonText>Go to UI</ButtonText>
                </Button>
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