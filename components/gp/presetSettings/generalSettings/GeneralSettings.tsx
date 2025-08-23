import BoundBox from "@/components/BoundBox";
import NumericSlider from "@/components/NumericSlider";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { useScrolling } from "@/contexts/scroll-context";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import React from "react";


function GeneralSettings() {
    if (store.gp200.currentPreset == undefined) {return null};

    const { enableScrolling, disableScrolling} = useScrolling();

    return (
        <BoundBox>
            <VStack space="lg">
                <Center>
                    <Heading>Preset General Settings</Heading>
                </Center>
                <NumericSlider 
                    name={"Volume"}
                    minValue={0}
                    maxValue={100}
                    step={1}
                    currentValue={store.gp200.currentPreset.volume}
                    onSlidingStart={(_) => {
                        disableScrolling();
                    }}
                    onSlidingComplete={(n: number) => {
                        enableScrolling();
                        store.gpActions.ChangePresetVolume(n);
                    }}                
                />
                <NumericSlider 
                    name={"BPM"}
                    minValue={40}
                    maxValue={250}
                    step={1}
                    currentValue={store.gp200.currentPreset.bpm}
                    onSlidingStart={(_) => {
                        disableScrolling();
                    }}
                    onSlidingComplete={(n: number) => {
                        enableScrolling();
                        store.gpActions.ChangePresetBPM(n);
                    }}                
                />
                <NumericSlider 
                    name={"Pan"}
                    minValue={-100}
                    maxValue={100}
                    step={1}
                    currentValue={store.gp200.currentPreset.pan}
                    onSlidingStart={(_) => {
                        disableScrolling();
                    }}
                    onSlidingComplete={(n: number) => {
                        enableScrolling();
                        store.gpActions.ChangePresetPan(n);
                    }}                
                />
            </VStack>
        </BoundBox>
    );
}

export default observer(GeneralSettings);