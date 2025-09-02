import BoundBox from "@/components/BoundBox";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { useCallback, useState } from "react";
import ExpSettings from "./ExpSettings";


function ExpsSettings() {
    const [selectedExp, setSelectedExp] = useState(0);
    const [selectedParam, setSelectedParam] = useState(0);
    const changeSelectedExp = useCallback((n: number) => {
        setSelectedExp(n);
    }, []);
    const changeSelectedParam = useCallback((n: number) => {
        setSelectedParam(n);
    }, []);

    return (
        <BoundBox>
            <VStack space="lg">
                <Center>
                    <Heading>EXP Settings</Heading>
                </Center>
                <ButtonGroup space="md" flexDirection="row" style={{ alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap'}}>
                    <Button action="primary" variant={selectedExp == 0 ? "solid" : "outline"} onPress={() => changeSelectedExp(0)}>
                        <ButtonText>EXP 1A</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedExp == 1 ? "solid" : "outline"} onPress={() => changeSelectedExp(1)}>
                        <ButtonText>EXP 1B</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedExp == 2 ? "solid" : "outline"} onPress={() => changeSelectedExp(2)}>
                        <ButtonText>EXP 2</ButtonText>
                    </Button>
                </ButtonGroup>
                <Divider/>
                <ButtonGroup space="md" flexDirection="row" style={{ alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                    <Button action="primary" variant={selectedParam == 0 ? "solid" : "outline"} onPress={() => changeSelectedParam(0)}>
                        <ButtonText>Param 1</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedParam == 1 ? "solid" : "outline"} onPress={() => changeSelectedParam(1)}>
                        <ButtonText>Param 2</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedParam == 2 ? "solid" : "outline"} onPress={() => changeSelectedParam(2)}>
                        <ButtonText>Param 3</ButtonText>
                    </Button>
                </ButtonGroup>
                <Divider/>
                <ExpSettings expID={selectedExp} expParamID={selectedParam}/>
            </VStack>
        </BoundBox>
    );
}

export default ExpsSettings;