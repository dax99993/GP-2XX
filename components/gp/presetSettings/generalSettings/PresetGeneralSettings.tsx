import BoundBox from "@/components/BoundBox";
import NumericSlider from "@/components/NumericSlider";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import React from "react";


function PresetGeneralSettings() {

    return (
        <BoundBox>
            <VStack space="lg">
                <Center>
                    <Heading>Preset Settings</Heading>
                </Center>
                <NumericSlider 
                    name={"Volume"}
                    minValue={0}
                    maxValue={100}
                    step={1}
                    currentValue={50}
                    onChange={function (n: number): void {
                    }}                
                />
                <NumericSlider 
                    name={"BPM"}
                    minValue={40}
                    maxValue={250}
                    step={1}
                    currentValue={120}
                    onChange={function (n: number): void {
                    }}                
                />
                <NumericSlider 
                    name={"Pan"}
                    minValue={-50}
                    maxValue={50}
                    step={1}
                    currentValue={0}
                    onChange={function (n: number): void {
                    }}                
                />
            </VStack>
        </BoundBox>
    );
}

export default PresetGeneralSettings;