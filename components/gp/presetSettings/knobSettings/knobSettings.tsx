import BoundBox from "@/components/BoundBox";
import PickerSelector from "@/components/pickerSelector";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { KnobModule } from "@/models/preset/IKnobSettings";
import React from "react";


function KnobSettings() {
    const names: string[] = Object.keys(KnobModule).filter(
        (key) => isNaN(Number(key))
    );
    console.log(names);
    const values: number[] = Object.values(KnobModule).filter(
        (value) => typeof value === 'number'
    );
    console.log(values);
    const labels: [string, string][] = values.map((item, index) => [item.toString(), names[index]]);
    console.log(labels);
    //const labels = Object.values(KnobModule)

    return (
        <BoundBox>
            <VStack space="lg">
                <Center>
                    <Heading>Knob Settings</Heading>
                </Center>
                <ButtonGroup space="md" flexDirection="row" style={{alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button>
                        <ButtonText>Knob 1</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>Knob 2</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>Knob 3</ButtonText>
                    </Button>
                </ButtonGroup>
                <Divider/>
            <PickerSelector name={"Module"}
                currentValue={""}
                labels={labels}
                onChange={function (s: string, n: number): void {
                    console.log("selected Knob Module", s, n);
                }}
            />
            <PickerSelector name={"Param Name"}
                currentValue={""}
                labels={[["0", "Param0"], ["1", "Param1"]]}
                onChange={function (s: string, n: number): void {
                    console.log("selected Param", s, n);
                }}
            />
            </VStack>
        </BoundBox>
    );
}

export default KnobSettings;