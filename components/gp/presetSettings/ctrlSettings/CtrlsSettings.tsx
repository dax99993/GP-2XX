import BoundBox from "@/components/BoundBox";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { useCallback, useState } from "react";
import CtrlSettings from "./CtrlSettings";



function CtrlsSettings() {
    const [selectedCtrl, setSelectedCtrl] = useState(0);
    const changeSelectedCtrl = useCallback((n: number) => {
        setSelectedCtrl(n);
    }, []);

    return (
        <BoundBox>
            <VStack space="lg">
                <Center>
                    <Heading>Ctrl Settings</Heading>
                </Center>
                <ButtonGroup space="md" flexDirection="row" style={{alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button action="primary" variant={selectedCtrl == 0 ? "solid" : "outline"} onPress={() => changeSelectedCtrl(0)}>
                        <ButtonText>CTRL 1</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedCtrl == 1 ? "solid" : "outline"} onPress={() => changeSelectedCtrl(1)}>
                        <ButtonText>CTRL 2</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedCtrl == 2 ? "solid" : "outline"} onPress={() => changeSelectedCtrl(2)}>
                        <ButtonText>CTRL 3</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedCtrl == 3 ? "solid" : "outline"} onPress={() => changeSelectedCtrl(3)}>
                        <ButtonText>CTRL 4</ButtonText>
                    </Button>
                </ButtonGroup>
                <ButtonGroup space="md" flexDirection="row" style={{alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button action="primary" variant={selectedCtrl == 4 ? "solid" : "outline"} onPress={() => changeSelectedCtrl(4)}>
                        <ButtonText>CTRL 5</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedCtrl == 5 ? "solid" : "outline"} onPress={() => changeSelectedCtrl(5)}>
                        <ButtonText>CTRL 6</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedCtrl == 6 ? "solid" : "outline"} onPress={() => changeSelectedCtrl(6)}>
                        <ButtonText>CTRL 7</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedCtrl == 7 ? "solid" : "outline"} onPress={() => changeSelectedCtrl(7)}>
                        <ButtonText>CTRL 8</ButtonText>
                    </Button>
                </ButtonGroup>
                <Divider/>
                <CtrlSettings ctrlID={selectedCtrl}/>
            </VStack>
        </BoundBox>
    )
}

export default CtrlsSettings;