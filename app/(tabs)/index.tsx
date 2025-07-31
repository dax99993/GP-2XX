import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { store } from '@/models/store';
import { MIDIAccess } from "@motiz88/react-native-midi";
import { observer } from 'mobx-react-lite';

import SyncingModal from '@/components/syncingModal/Modal';
import { useEffect, useState } from 'react';


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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [syncingProgress, setSyncingProgress] = useState(0);
    const [modalBody, setModalBody] = useState("");
    const [startSyncing, setStartSyncing] = useState(false);

    useEffect(() => {
        const totalPresets = 256;
        setSyncingProgress(store.gp200.syncedPresets / totalPresets * 100);
        setModalBody(`Loading preset ${store.gp200.presets.length}`)

        if (store.gp200.presets.length == totalPresets) {
            setIsModalOpen(false);
            router.replace('/ui/preset');
        } else {
            store.gpActions.AskPresetInfo(store.gp200.syncedPresets);
        }
    }
    , [store.gp200.syncedPresets, startSyncing]);

    const scan_for_devices = () => {
        console.log('scanning');
        store.gpActions.midi.getMidiAccess();
        console.log('inputs: ', store.gpActions.midi.inputs);
        console.log('outputs', store.gpActions.midi.outputs);
    }

    const connect_procedure = (id:string) => {
        // Add input and output midi ports
        console.log("id: ", id); 
        store.gpActions.midi.setInput(id);
        store.gpActions.midi.setOutput(id);

        // Start listening to midi messages
        store.gpDeviceActions.setupReceivedSysEx();

        // Load presets from device.
        setIsModalOpen(true);
        setStartSyncing(true);
    };


    return (
        <VStack className="bg-secondary-0" style={{flex: 1}}>
            <SyncingModal
                isOpen={isModalOpen}
                headerTitle='Sync Gp-200'
                bodyText={modalBody}
                progressValue={ syncingProgress }
            />
            <Text style={styles.text}>Connection screen</Text>
            <View style={{flex: 4}}>
                <Button size="md" variant="solid" action="primary" onPress={scan_for_devices}>
                    <ButtonText>Scan for devices</ButtonText>
                </Button>
                { 
                    store.gpActions.midi.inputs && store.gpActions.midi.inputs?.size != 0 &&
                    store.gpActions.midi.outputs && store.gpActions.midi.outputs?.size != 0 &&
                    <View>
                        <Text style={styles.text}>Found Devices</Text>
                        <View style={{ flexDirection: 'column', alignContent: 'space-between', justifyContent: 'space-between', marginBottom: 20 }}>
                            {[...store.gpActions.midi.inputs.entries()].map(([key, input]) => (
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.text}>{input.name}</Text>
                                    <Button size="md" variant="solid" action="primary" onPress={() => connect_procedure(key)}>
                                        <ButtonText>Connect</ButtonText>
                                    </Button>
                                </View>
                            ))}
                        </View>
                    </View>
                }
                <Buttons/>
            </View>
        </VStack>
    );
}

function Buttons() {
    const router = useRouter();

    return (
        <HStack style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 100 }}>
            <Button size="md" variant="solid" action="primary" onPress={() => { router.navigate('/about') }}>
                <ButtonText>About</ButtonText>
            </Button>
            <Button size="md" variant="solid" action="primary" onPress={() => { router.replace('/ui/preset') }}>
                <ButtonText>Go to UI</ButtonText>
            </Button>
        </HStack>
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