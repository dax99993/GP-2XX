import { DoubleParameterModel } from "@/models/parameter/doubleParameter";
import { store } from "@/models/store";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";
import { useParameter } from "./Parameter";


function DoubleParameter() {
    const param = useParameter() as DoubleParameterModel;

    const isSecondRangeActive = param.current_range_idx === 1;
    console.log("second range activated? = ", isSecondRangeActive);

    const onChangeNumeric = (v: number) => {
       //const a = param.setValue(v);
       //store.gp200.changeParamValue(param.name, v);
       store.gp200.changeParamValue(store.gp200.current_effect.type, param.id, v);
       //console.log("Numeric new value = ", v);
       console.log(`Numeric assign value (${param.name})= ${v}`);
    };

    const onChangeSelect = (v:string, n: number) => {
        console.log("param picker new value = ", v, n);
        //store.gp200.changeParamValue(param.name, n);
        //store.gp200.changeParamValue(param.name, n);
        store.gp200.changeParamValue(store.gp200.current_effect.type, param.id, n);
        console.log(`Select assign value (${param.name}) = ${n}, ${v}`);
    };

    const labelEntries = Object.entries(param.labels);
    //console.log("Double labels = ", labelEntries);

    const pickerItems = labelEntries.map(e => (
        <Picker.Item key={e[0]} value={e[0]} label={e[1]}/>
    ));

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.paramName}>{param.name}</Text>
                {!isSecondRangeActive && <Text>{param.getStringValue()}</Text>}
            </View>
            {
                !isSecondRangeActive && 
                <Slider style={styles.controlContainer}
                    //style={{width:200, height:40}}
                    minimumValue={param.min_value[0]}
                    maximumValue={param.max_value[0]}
                    step={param.step_size[0]}
                    value={param.current_value[0]}
                    onValueChange={onChangeNumeric}
                />
            }
            {
            isSecondRangeActive &&
                <Picker style={styles.controlContainer}
                    mode="dropdown"
                    selectedValue={param.current_value[1].toString()}
                    onValueChange={onChangeSelect}
                >
                    {
                        pickerItems
                    }
                </Picker>
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        //flex: 1,
        flexDirection: 'column',
        paddingVertical: 10,
        backgroundColor: 'lightgreen',
    },
    infoContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 15,
    },
    controlContainer: {
        marginLeft: 15,
        marginRight: 30,
    },
    paramName: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});
export default observer(DoubleParameter);