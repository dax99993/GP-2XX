import BoundBox from "@/components/core/BoundBox";
import NumericSlider from "@/components/core/NumericSlider";
import PickerSelector from "@/components/core/PickerSelector";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { useScrolling } from "@/contexts/scroll-context";
import { useStore } from "@/hooks/useStore";
import { observer } from "mobx-react-lite";
import FxLoopSlider from "./FxLoopSlider";

function FxLoopSettings() {
    const store = useStore();
    // if (store.gp200.currentPreset == undefined) {return null};

    const { enableScrolling, disableScrolling} = useScrolling();

    const sendPosition = store.gp200.currentPreset ? store.gp200.currentPreset.fxLoop.sendPosition : 0;
    const returnPosition = store.gp200.currentPreset ? store.gp200.currentPreset.fxLoop.returnPosition : 0;
    const sendLevel = store.gp200.currentPreset ? store.gp200.currentPreset.fxLoop.sendLevel : 0;
    const returnLevel = store.gp200.currentPreset ? store.gp200.currentPreset.fxLoop.returnLevel : 0;
    const mode = store.gp200.currentPreset ? store.gp200.currentPreset.fxLoop.mode : 0;

    console.log("FxLoop SendLevel", sendLevel, "ReturnLevel", returnLevel, "Mode",mode);

    const onSlidingComplete = (values: number []) => {
        console.log("New FxLoop position values", values);
        store.gpMidiEncoder.ChangePresetFxLoopPosition(values[0], values[1]);
    }

    return (
        <BoundBox>
            <Center>
                <Heading>FXLoop Settings</Heading>
            </Center>
            <FxLoopSlider
                name={"Send & Return position"}
                minValue={0}
                maxValue={11}
                step={1}
                lowValue={sendPosition}
                highValue={returnPosition}
                onSlidingStart={(_) => {
                        disableScrolling();
                }}
                onSlidingComplete={(range: [number, number]) => {
                    enableScrolling();
                    onSlidingComplete(range);
                }}
            />
            <NumericSlider
                name={"Send level"}
                minValue={0}
                maxValue={100}
                step={1}
                currentValue={sendLevel}
                onSlidingStart={(_) => {
                    disableScrolling();
                }}
                onSlidingComplete={(n: number) => {
                    //console.log(n);
                    enableScrolling();
                    store.gpMidiEncoder.ChangePresetFxLoopSendLevel(n);
                }}
            />
            <NumericSlider
                name={"Return level"}
                minValue={0}
                maxValue={100}
                step={1}
                currentValue={returnLevel}
                onSlidingStart={(_) => {
                    disableScrolling();
                }}
                onSlidingComplete={(n: number) => {
                    enableScrolling();
                    store.gpMidiEncoder.ChangePresetFxLoopReturnLevel(n);
                } }
            />
            <PickerSelector
                name={"Mode"}
                currentValue={mode.toString()}
                labels={[["0", "Parallel"], ["1", "Series"]]}
                onChange={function (s: string, n: number): void {
                    //console.log(s);
                    store.gpMidiEncoder.ChangePresetFxLoopMode(n);
                }}            
            />
        </BoundBox>
    );
}


export default observer(FxLoopSettings);