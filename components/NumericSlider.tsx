import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Slider } from '@react-native-assets/slider';
import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";

type NumericSliderProps = {
    name: string;
    shownValue?: (n: number) => string;
    minValue: number;
    maxValue: number;
    step: number;
    currentValue: number;
    onChange: (n:number) => void;
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
            <VStack style={styles.infoContainer}>
                <Text size="lg" bold={true}>{props.name}</Text>
                <Text>{shownValue}</Text>
            </VStack>
            <Slider
                style={styles.controlContainer}
                minimumValue={props.minValue}
                maximumValue={props.maxValue}
                step={props.step}
                value={props.currentValue}
                onValueChange={(n: number) => {
                    setValue(n);
                    setIsSliding(true);
                }}
                onSlidingComplete={(n: number) => {
                    props.onChange(n);
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
    infoContainer: {
        marginLeft: 15,
    },
    controlContainer: {
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
    },
});


export default NumericSlider;