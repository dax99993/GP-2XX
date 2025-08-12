import BoundBox from "@/components/BoundBox";
import NumericSlider from "@/components/NumericSlider";
import PickerSelector from "@/components/pickerSelector";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import FxLoopPositionSlider from "./FxLoopPositionSlider";
import FxLoopSlider from "./FxLoopSlider";

function FxLoopSettings() {
    if (store.gp200.currentPreset == undefined) {return null};

    const sendPosition = store.gp200.currentPreset.fxLoop.sendPosition;
    const returnPosition = store.gp200.currentPreset.fxLoop.returnPosition;
    const sendLevel = store.gp200.currentPreset.fxLoop.sendLevel;
    const returnLevel = store.gp200.currentPreset.fxLoop.returnLevel;
    const mode = store.gp200.currentPreset.fxLoop.mode;

    console.log(sendLevel, returnLevel, mode);

    const onChange = (l: number, h: number) => {
        console.log("New values low, high", l, h);
        store.gpActions.ChangePresetFxLoopPosition(l, h);
    }

    const onChange2 = (values: number []) => {
        console.log("New values", values);
        store.gpActions.ChangePresetFxLoopPosition(values[0], values[1]);
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
                step={0}
                lowValue={sendPosition}
                highValue={returnPosition}
                onChange={onChange2}            
            />
            <FxLoopPositionSlider
                name={"Send & Return position"}
                minValue={0}
                maxValue={11}
                step={1}
                lowValue={sendPosition}
                highValue={returnPosition}
                onChange={function (low: number, high: number): void {
                    // Update the model through action
                    if (low !== sendPosition) {

                    }
                    if(high !== returnPosition) {
                        //store.gpActions.ChangePresetFxLoopPosition(low, high);
                        store.gpActions.ChangePresetFxLoopReturnPosition(high);
                    }
                }}            
                />
            <NumericSlider
                name={"Send level"}
                minValue={0}
                maxValue={100}
                step={1}
                currentValue={sendLevel}
                onChange={function (n: number): void {
                    console.log(n);
                    store.gpActions.ChangePresetFxLoopSendLevel(n);
                }}
            />
            <NumericSlider
                name={"Return level"}
                minValue={0}
                maxValue={100}
                step={1}
                currentValue={returnLevel}
                onChange={function (n: number): void {
                    store.gpActions.ChangePresetFxLoopReturnLevel(n);
                } }
            />
            <PickerSelector
                name={"Mode"}
                currentValue={mode.toString()}
                labels={[["0", "Parallel"], ["1", "Series"]]}
                onChange={function (s: string, n: number): void {
                    console.log(s);
                    store.gpActions.ChangePresetFxLoopMode(n);
                }}            
            />
        </BoundBox>
    );
}


export default observer(FxLoopSettings);