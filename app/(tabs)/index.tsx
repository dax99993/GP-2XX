import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { Platform, StatusBar, StyleSheet } from "react-native";

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { observer } from 'mobx-react-lite';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useEffect } from 'react';

import TopBar from '@/components/topBar/TopBar';
import { Center } from '@/components/ui/center';
import { SmartphoneIcon } from 'lucide-react-native';

import GPIcon from "@/assets/images/svgs/GPIcon4.svg";
import UsbCable from "@/assets/images/svgs/usbcable.svg";
import useOrientation from '@/hooks/useOrientation';
import { useStore } from '@/hooks/useStore';

function HomeScreen() {
    const store = useStore();
    const router = useRouter();
    const {orientation} = useOrientation();

    useEffect(() => {
        console.log("use Effect detected change in isSynced!");
        if (store.gp200.isSynced) {
            router.replace('/ui/edit/edit_effect');
        }
    }, [store.gp200.isSynced])


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
                <Heading size='3xl'>GP-2XX</Heading>
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
        </VStack>
    );
}

function Buttons() {
    const router = useRouter();

    return (
        <HStack>
            {/* <Button
                size="md"
                variant="outline"
                action="secondary"
                onPress={() => {
                    router.navigate('/about')
                }}
            >
                <ButtonText>About</ButtonText>
                <ButtonIcon as={InfoIcon}/>
            </Button> */}
            {/* <Button size="md"
                variant="solid"
                action="primary"
                onPress={() => { 
                    router.replace('/ui/testscreen/screen1');
                 }}
            >
                <ButtonText>Test Screen</ButtonText>
            </Button> */}
            <Button size="md"
                variant="solid"
                action="primary"
                onPress={() => { 
                    //router.replace('/ui/testscreen/screen1') 
                    router.replace('/ui/edit/edit_effect');
                 }}
            >
                <ButtonText>Skip</ButtonText>
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