import BoundBox from "@/components/core/BoundBox";
import NumericSlider from "@/components/core/NumericSlider";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";

export const EqualizerSettings = () => {
    const sendLevel = 20;
  return (
        <BoundBox>
            <Center>
                <Heading>EQ Settings</Heading>
            </Center>
            <NumericSlider
                name={"Level"}
                minValue={0}
                maxValue={100}
                step={1}
                currentValue={sendLevel}
                onSlidingStart={(_) => {
                    // disableScrolling();
                }}
                onSlidingComplete={(n: number) => {
                    //console.log(n);
                    // enableScrolling();
                    // store.gpMidiEncoder.ChangePresetFxLoopSendLevel(n);
                }}
            />
            <NumericSlider
                name={"Low cut"}
                shownValue={(n) => n + ' Hz'}
                minValue={19}
                maxValue={20_000}
                step={1}
                currentValue={20}
                onSlidingStart={(_) => {
                    // disableScrolling();
                }}
                onSlidingComplete={(n: number) => {
                    //console.log(n);
                    // enableScrolling();
                    // store.gpMidiEncoder.ChangePresetFxLoopSendLevel(n);
                }}
            />
            <NumericSlider
                name={"Band 1 Freq"}
                minValue={20}
                maxValue={20_000}
                step={1}
                currentValue={50}
                onSlidingStart={(_) => {
                    // disableScrolling();
                }}
                onSlidingComplete={(n: number) => {
                    //console.log(n);
                    // enableScrolling();
                    // store.gpMidiEncoder.ChangePresetFxLoopSendLevel(n);
                }}
            />
            <NumericSlider
                name={"Band 1 Q"}
                minValue={0.1}
                maxValue={10.0}
                step={0.1}
                currentValue={0.7}
                onSlidingStart={(_) => {
                    // disableScrolling();
                }}
                onSlidingComplete={(n: number) => {
                    //console.log(n);
                    // enableScrolling();
                    // store.gpMidiEncoder.ChangePresetFxLoopSendLevel(n);
                }}
            />
            <NumericSlider
                name={"Band 1 Gain"}
                shownValue={(n) => n + ' dB'}
                minValue={-20}
                maxValue={20}
                step={1}
                currentValue={0}
                onSlidingStart={(_) => {
                    // disableScrolling();
                }}
                onSlidingComplete={(n: number) => {
                    //console.log(n);
                    // enableScrolling();
                    // store.gpMidiEncoder.ChangePresetFxLoopSendLevel(n);
                }}
            />
            <NumericSlider
                name={"High cut"}
                minValue={0}
                maxValue={100}
                step={1}
                currentValue={sendLevel}
                onSlidingStart={(_) => {
                    // disableScrolling();
                }}
                onSlidingComplete={(n: number) => {
                    //console.log(n);
                    // enableScrolling();
                    // store.gpMidiEncoder.ChangePresetFxLoopSendLevel(n);
                }}
            />
        </BoundBox>
  );
}