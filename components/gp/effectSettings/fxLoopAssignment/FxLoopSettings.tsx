import BoundBox from "@/components/BoundBox";
import NumericSlider from "@/components/NumericSlider";
import PickerSelector from "@/components/pickerSelector";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import FxLoopPositionSlider from "./FxLoopPositionSlider";

function FxLoopSettings() {
    return (
        <BoundBox>
            <Center>
                <Heading>FXLoop Settings</Heading>
            </Center>
            <FxLoopPositionSlider
                name={"Send & Return position"}
                currentValue={10}
            />
            <NumericSlider
                name={"Send level"}
                minValue={0}
                maxValue={100}
                step={1}
                currentValue={20}
                onChange={function (n: number): void {
                    console.log(n);
                }}
            />
            <NumericSlider
                name={"Return level"}
                minValue={0}
                maxValue={100}
                step={1}
                currentValue={30}
                onChange={function (n: number): void {
                } }
            />
            <PickerSelector
                name={"Mode"}
                currentValue={"0"}
                labels={[["0", "Parallel"], ["1", "Series"]]}
                onChange={function (s: string, n: number): void {
                    console.log(s);
                }}            
            />
        </BoundBox>
    );
}


export default FxLoopSettings;