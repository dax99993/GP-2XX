import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { StyleSheet } from "react-native";

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { store } from '@/models/store';
import { observer } from 'mobx-react-lite';

import SyncingModal from '@/components/syncingModal/Modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useEffect, useState } from 'react';



function HomeScreen() {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [syncingProgress, setSyncingProgress] = useState(0);
    const [modalBody, setModalBody] = useState("");
    const [startSyncing, setStartSyncing] = useState(false);

    useEffect(() => {
        store.midi.getMidiAccess();
    }, [])

    useEffect(() => {
        if (store.midi.inputPort) {
            // Start listening to midi messages
            store.gpDeviceActions.setupReceivedSysEx();

            // Load presets from device.
            setIsModalOpen(true);
            setStartSyncing(true);
        }
    }, [store.midi.inputPort])

    useEffect(() => {
        if (startSyncing) {
            const totalPresets = 5;
            setSyncingProgress(store.gp200.syncedPresets / totalPresets * 100);
            setModalBody(`Loading preset ${store.gp200.presets.length}`)

            if (store.gp200.presets.length == totalPresets) {
                setIsModalOpen(false);
                router.replace('/ui/preset');
            } else {
                store.gpActions.AskPresetInfo(store.gp200.syncedPresets);
            }
        }
    }
    , [store.gp200.syncedPresets, startSyncing]);





    return (
        <VStack className="bg-secondary-0" style={{flex: 1}}>
            <SyncingModal
                isOpen={isModalOpen}
                headerTitle='Sync Gp-200'
                bodyText={modalBody}
                progressValue={ syncingProgress }
            />
            <Heading>Gp-200 controller</Heading>
            <Text>Please connect GP-200 device</Text>
            <Buttons></Buttons>
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