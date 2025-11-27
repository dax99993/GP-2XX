import BoundBox from "@/components/core/BoundBox";
import NumericSlider from "@/components/core/NumericSlider";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { useScrolling } from "@/contexts/scroll-context";
import { useStore } from "@/hooks/useStore";
import { observer } from "mobx-react-lite";
import React from "react";


function GeneralSettings() {
    const store = useStore();
    //if (store.gp200.currentPreset == undefined) {return null};

    const volume = store.gp200.currentPreset ? store.gp200.currentPreset.volume : 0;
    const bpm = store.gp200.currentPreset ? store.gp200.currentPreset.bpm : 0;
    const pan = store.gp200.currentPreset ? store.gp200.currentPreset.pan : 0;

    const { enableScrolling, disableScrolling} = useScrolling();

    return (
        <BoundBox>
            <VStack space="xs">
                <Center>
                    <Heading>General Settings</Heading>
                </Center>
                <NumericSlider 
                    name={"Volume"}
                    minValue={0}
                    maxValue={100}
                    step={1}
                    currentValue={volume}
                    onSlidingStart={(_) => {
                        disableScrolling();
                    }}
                    onSlidingComplete={(n: number) => {
                        enableScrolling();
                        store.gpMidiEncoder.ChangePresetVolume(n);
                    }}                
                />
                <NumericSlider 
                    name={"BPM"}
                    minValue={40}
                    maxValue={250}
                    step={1}
                    currentValue={bpm}
                    onSlidingStart={(_) => {
                        disableScrolling();
                    }}
                    onSlidingComplete={(n: number) => {
                        enableScrolling();
                        store.gpMidiEncoder.ChangePresetBPM(n);
                    }}                
                />
                <NumericSlider 
                    name={"Pan"}
                    minValue={-100}
                    maxValue={100}
                    step={1}
                    currentValue={pan}
                    onSlidingStart={(_) => {
                        disableScrolling();
                    }}
                    onSlidingComplete={(n: number) => {
                        enableScrolling();
                        store.gpMidiEncoder.ChangePresetPan(n);
                    }}                
                />
            </VStack>
        </BoundBox>
    );
}

export default observer(GeneralSettings);