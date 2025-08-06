import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { StyleSheet } from "react-native";

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { store } from '@/models/store';
import { observer } from 'mobx-react-lite';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useEffect } from 'react';

import { Center } from '@/components/ui/center';
import Atomic from "../../assets/images/atomic.svg";



function HomeScreen() {
    const router = useRouter();

    useEffect(() => {
        if (store.gp200.syncedPresets > 1) {
            router.replace('/ui/preset');
            store.modals.closeModal('syncModal');
        }
    }, [store.gp200.syncedPresets])


    return (
        <VStack className="bg-secondary-0" style={{flex: 1, justifyContent: 'space-between', alignItems:"stretch"}}>
            <Heading>Gp-200 controller</Heading>
            <Text>Please connect GP-200 device</Text>
            <Buttons></Buttons>
            <Center style={{backgroundColor:"pink", maxHeight: 200}}>
                <Atomic scaleX={0.1} scaleY={0.1}/>
            </Center>
            <Center style={{backgroundColor:"lightgreen", maxHeight: 200}}>
                <Atomic scaleX={0.1} scaleY={0.1}/>
            </Center>
        </VStack>
    );
}

function Buttons() {
    const router = useRouter();

    return (
        <HStack style={{ justifyContent: 'flex-end', paddingBottom: 100 , backgroundColor: "orange"}}>
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