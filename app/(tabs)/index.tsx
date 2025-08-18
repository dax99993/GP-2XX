import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { Platform, StatusBar, StyleSheet } from "react-native";

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { store } from '@/models/store';
import { observer } from 'mobx-react-lite';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useEffect } from 'react';

import TopBar from '@/components/topBar/TopBar';
import { Center } from '@/components/ui/center';
import { InfoIcon, SmartphoneIcon } from 'lucide-react-native';

import GPIcon from "@/assets/images/svgs/GPIcon4.svg";
import UsbCable from "@/assets/images/svgs/usbcable.svg";

function HomeScreen() {
    const router = useRouter();

    useEffect(() => {
        if (store.gp200.syncedPresets > 1) {
            //router.replace('/ui/preset');
            store.gp200.changePreset(0);
            router.replace('/ui/edit/effecttab');
            store.modals.closeModal('syncModal');
        }
    }, [store.gp200.syncedPresets])



    return (
        <VStack space="md" className="bg-secondary-0" style={styles.maincontainer}>
            <TopBar>
                <TopBar.centerItems>
                    <></>
                </TopBar.centerItems>
                <TopBar.rightItems>
                    <Buttons></Buttons>
                    <></>
                </TopBar.rightItems>
            </TopBar>

            <Center>
                <Heading size='3xl'>GP-200 Controller</Heading>
            </Center>


            <Center className='bg-secondary-400 mx-5 my-5 px-3 py-3 rounded-xl'>
                <Text size='2xl'>Please connect GP-200</Text>
                <Text size='2xl'>to your device</Text>
                <Text></Text>
                <HStack space="xl" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <GPIcon scaleX={1.0} scaleY={1.0} width={80} height={70} fill={'black'} color={'black'} stroke={'black'}/>
                    <UsbCable scaleX={1.0} scaleY={1.0} width={40} height={40} fill={'white'}/>
                    <SmartphoneIcon height={70} width={50} color={'white'}/>
                </HStack>
            </Center>
            {/* <Center style={{backgroundColor:"pink", maxHeight: 200}}>
                <Atomic scaleX={0.1} scaleY={0.1}/>
            </Center>
            <Center style={{backgroundColor:"lightgreen", maxHeight: 200}}>
                <Atomic scaleX={0.1} scaleY={0.1}/>
            </Center> */}
        </VStack>
    );
}

function Buttons() {
    const router = useRouter();

    return (
        <HStack>
            <Button
                size="md"
                variant="outline"
                action="secondary"
                onPress={() => {
                    router.navigate('/about')
                }}
            >
                <ButtonText>About</ButtonText>
                <ButtonIcon as={InfoIcon}/>
            </Button>
            <Button size="md"
                variant="solid"
                action="primary"
                onPress={() => { 
                    router.replace('/ui/testscreen/screen1') 
                 }}
            >
                <ButtonText>Go to UI</ButtonText>
            </Button>
        </HStack>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        //flexDirection: 'column',
        //alignItems: 'stretch',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    text: {
        color: 'white',
        fontSize: 20,
        marginRight: 20,
    }
})

export default observer(HomeScreen);