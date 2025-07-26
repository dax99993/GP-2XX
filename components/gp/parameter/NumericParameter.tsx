import { NumericParameterModel } from "@/models/parameter/numericParameter";
import { store } from "@/models/store";
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

type NumericParameterProps = {
    param: NumericParameterModel
}

function NumericParameter({param}: NumericParameterProps) {

    const onChange = (n: number) => {
       //store.gp200.changeParamValue(store.gp200.current_effect.type, param.id, v);
       store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
       console.log(`Numeric assign value (${param.name})= ${n}`);
    };

    return (
        <VStack className="bg-secondary-0">
            <Box className="bg-secondary-300 mx-3 my-2 px-2 pt-3 pb-5 rounded-md"> 
            <VStack style={styles.infoContainer}>
                <Text size="lg" bold={true}>{param.name}</Text>
                <Text>{param.getStringValue()}</Text>
            </VStack>
            <Slider
                style={styles.controlContainer}
                size="lg"
                sliderTrackHeight={15}
                minValue={param.min_value[0]}
                maxValue={param.max_value[0]}
                step={param.step_size[0]}
                value={param.current_value[0]}
                onChange={onChange}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>

            </Box>
        </VStack>
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