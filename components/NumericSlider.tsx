//import Slider from "@react-native-community/slider";
import { Box } from "@/components/ui/box";
import {
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
} from "@/components/ui/slider";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";

type NumericSliderProps = {
    name: string;
    shownValue?: string;
    minValue: number;
    maxValue: number;
    step: number;
    currentValue: number;
    onChange: (n:number) => void;
}

function NumericParameter(props: NumericSliderProps) {
    const shownValue = props.shownValue != undefined ? props.shownValue : props.currentValue;

    return (
        <Box className="bg-secondary-300 mx-3 my-2 px-2 pt-3 pb-5 rounded-md">
            <VStack style={styles.infoContainer}>
                <Text size="lg" bold={true}>{props.name}</Text>
                <Text>{shownValue}</Text>
            </VStack>
            <Slider
                style={styles.controlContainer}
                size="lg"
                sliderTrackHeight={15}
                minValue={props.minValue}
                maxValue={props.maxValue}
                step={props.step}
                value={props.currentValue}
                onChange={props.onChange}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>

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
        marginLeft: 20,
        paddingRight: 50,
    },
});


export default observer(NumericParameter);