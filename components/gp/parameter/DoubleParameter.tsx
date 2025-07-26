import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { DoubleParameterModel } from "@/models/parameter/doubleParameter";
import { store } from "@/models/store";
//import Slider from "@react-native-community/slider";
import {
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
} from "@/components/ui/slider";
import { Text } from "@/components/ui/text";
import { Picker } from "@react-native-picker/picker";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";

type DoubleParameterProps = {
    param:DoubleParameterModel 
}

function DoubleParameter({param}: DoubleParameterProps) {

    const isSecondRangeActive = param.current_range_idx === 1;
    console.log("second range activated? = ", isSecondRangeActive);

    const onChangeNumeric = (n: number) => {
       //store.gp200.changeParamValue(store.gp200.current_effect.type, param.id, v);
       store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
       //console.log("Numeric new value = ", v);
       console.log(`Numeric assign value (${param.name})= ${n}`);
    };

    const onChangeSelect = (v:string, n: number) => {
        console.log("param picker new value = ", v, n);
        //store.gp200.changeParamValue(param.name, n);
        //store.gp200.changeParamValue(param.name, n);
        //store.gp200.changeParamValue(store.gp200.current_effect.type, param.id, n);
        store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
        console.log(`Select assign value (${param.name}) = ${n}, ${v}`);
    };

    const labelEntries = Object.entries(param.labels);
    //console.log("Double labels = ", labelEntries);

    const pickerItems = labelEntries.map(e => (
        <Picker.Item key={e[0]} value={e[0]} label={e[1]}/>
    ));

    return (
        <VStack className="bg-secondary-0">
            <Box className={`bg-secondary-300 mx-3 my-2 px-2 pt-3 rounded-md ${isSecondRangeActive ? "pb-0" : "pb-5"}`}>
                <VStack style={styles.infoContainer}>
                    <Text size="lg" bold={true}>{param.name}</Text>
                    {!isSecondRangeActive && <Text>{param.getStringValue()}</Text>}
                </VStack>
                {
                    !isSecondRangeActive && 
                    <Slider
                    style={styles.numericControlContainer}
                    size="lg"
                    sliderTrackHeight={15}
                    minValue={param.min_value[0]}
                    maxValue={param.max_value[0]}
                    step={param.step_size[0]}
                    value={param.current_value[0]}
                    onChange={onChangeNumeric}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                }
                {
                isSecondRangeActive &&
                    <Picker style={styles.selectControlContainer}
                        mode="dropdown"
                        selectedValue={param.current_value[1].toString()}
                        onValueChange={onChangeSelect}
                    >
                        {
                            pickerItems
                        }
                    </Picker>
                }
            </Box>
        </VStack>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'lightgreen',
    },
    infoContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 15,
    },
    numericControlContainer: {
        marginTop: 10,
        marginLeft: 20,
        paddingRight: 65,
    },
    selectControlContainer: {
        //marginTop: 10,
        //paddingTop:10,
        marginLeft: 15,
        marginRight: 30,
    },
});
export default observer(DoubleParameter);