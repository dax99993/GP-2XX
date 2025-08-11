import BoundBox from "@/components/BoundBox";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import React, { useCallback, useState } from "react";
import KnobSettings from "./knobSettings";


function KnobsSettings() {
    const [selectedKnob, setSelectedKnob] = useState(0);

    const changeSelectedKnob = useCallback((n: number) => {
        setSelectedKnob(n);
    }, []);

    return (
        <BoundBox>
            <VStack space="lg">
                <Center>
                    <Heading>Knob Settings</Heading>
                </Center>
                <ButtonGroup space="md" flexDirection="row" style={{alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button action="primary" variant={selectedKnob == 0 ? "solid" : "outline"} onPress={() => changeSelectedKnob(0)}>
                        <ButtonText>Knob 1</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedKnob == 1 ? "solid" : "outline"} onPress={() => changeSelectedKnob(1)}>
                        <ButtonText>Knob 2</ButtonText>
                    </Button>
                    <Button action="primary" variant={selectedKnob == 2 ? "solid" : "outline"} onPress={() => changeSelectedKnob(2)}>
                        <ButtonText>Knob 3</ButtonText>
                    </Button>
                </ButtonGroup>
                <Divider/>
                <KnobSettings knobID={selectedKnob}/>
            </VStack>
        </BoundBox>
    );
}

export default KnobsSettings;