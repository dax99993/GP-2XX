import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Slider } from '@react-native-assets/slider';
import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Center } from "./ui/center";

type NumericSliderProps = {
    name: string;
    shownValue?: (n: number) => string;
    minValue: number;
    maxValue: number;
    step: number;
    currentValue: number;
    onSlidingStart?: (n:number) => void;
    onValueChange?: (n:number) => void;
    onSlidingComplete?: (n:number) => void;
}

function NumericSlider(props: NumericSliderProps) {
    const [value, setValue] = useState(props.currentValue);
    const [isSliding, setIsSliding] = useState(false);

    const shownValue = useMemo(() => {
        let v;
        if (isSliding) {
            v = value;
        } else {
            v = props.currentValue;
        }
        const shownValue = props.shownValue != undefined ? props.shownValue(v) : v.toString();
        return shownValue;
    }, [props.shownValue, props.currentValue, value, isSliding])

    return (
        <Box className="bg-secondary-300 mx-3 my-2 px-2 pt-3 pb-5 rounded-md">
                <Center>
                    <Text size="lg" bold={true} style={styles.name}>{props.name}</Text>
                    <Text size="2xl" bold={true}>{shownValue}</Text>
                </Center>
            <Slider
                style={styles.controlContainer}
                minimumValue={props.minValue}
                maximumValue={props.maxValue}
                step={props.step}
                value={props.currentValue}
                onValueChange={(n: number) => {
                    if (props.onValueChange) props.onValueChange(n);
                    setValue(n);
                    setIsSliding(true);
                }}
                onSlidingStart={(n: number) => {
                    if(props.onSlidingStart) props.onSlidingStart(n);
                }}  
                onSlidingComplete={(n: number) => {
                    if(props.onSlidingComplete) props.onSlidingComplete(n);
                    setIsSliding(false);
                }}
                thumbTintColor="white"
                minimumTrackTintColor="white"
                trackHeight={20}
                thumbSize={30}
            />
        </Box>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    name: {
        position: 'absolute',
        left: 15,
    },
    controlContainer: {
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
    },
});


export default NumericSlider;