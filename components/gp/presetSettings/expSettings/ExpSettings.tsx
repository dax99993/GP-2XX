import BoundBox from "@/components/BoundBox";
import PickerSelector from "@/components/pickerSelector";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { ExpModule } from "@/models/preset/IExpSettings";
import ExpSlider from "./ExpSlider";


function ExpSettings() {
    const names: string[] = Object.keys(ExpModule).filter(
        (key) => isNaN(Number(key))
    );
    console.log(names);
    const values: number[] = Object.values(ExpModule).filter(
        (value) => typeof value === 'number'
    );
    console.log(values);
    const labels: [string, string][] = values.map((item, index) => [item.toString(), names[index]]);
    console.log(labels);
    return (
        <BoundBox>
            <VStack space="lg">
                <Center>
                    <Heading>EXP Settings</Heading>
                </Center>
                <ButtonGroup space="md" flexDirection="row" style={{ alignItems: 'center', justifyContent: 'space-around' }}>
                    <Button>
                        <ButtonText>EXP 1A</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>EXP 1B</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>EXP 2</ButtonText>
                    </Button>
                </ButtonGroup>
                <Divider/>
                <ButtonGroup space="md" flexDirection="row" style={{ alignItems: 'center', justifyContent: 'space-around' }}>
                    <Button>
                        <ButtonText>Param 1</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>Param 2</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>Param 3</ButtonText>
                    </Button>
                </ButtonGroup>
                <Divider/>
                <PickerSelector name={"Module"}
                    currentValue={""}
                    labels={labels}
                    onChange={function (s: string, n: number): void {
                        console.log("selected EXP Module", s, n);
                    }}
                />
                <PickerSelector name={"Param Name"}
                    currentValue={""}
                    labels={[["0", "Param0"], ["1", "Param1"]]}
                    onChange={function (s: string, n: number): void {
                        console.log("selected EXP Param", s, n);
                    }}
                />
                <ExpSlider name={"Param Name range"} currentValue={0} />
            </VStack>
        </BoundBox>
    );
}

export default ExpSettings;