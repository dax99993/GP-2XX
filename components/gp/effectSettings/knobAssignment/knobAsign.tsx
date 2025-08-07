import BoundBox from "@/components/BoundBox";
import PickerSelector from "@/components/pickerSelector";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import React from "react";


function KnobAssign() {
    return (
        <BoundBox>
            <Heading>Knob 1</Heading>
            <HStack space="4xl">
                <Text>Module </Text>
                <Text>Module effect</Text>
            </HStack>
            <PickerSelector name={"Module"}
                currentValue={""}
                labels={[["0", "Option 0"], ["1", "Option 1"]]}
                onChange={function (s: string, n: number): void {
                }}
            />
            <Text>Param name</Text>
        </BoundBox>
    );
}

export default KnobAssign;