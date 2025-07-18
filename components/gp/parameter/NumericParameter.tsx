import { NumericParameterModel } from "@/models/parameter/numericParameter";
import { store } from "@/models/store";
import Slider from "@react-native-community/slider";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";
import { useParameter } from "./Parameter";



function NumericParameter() {

    const param = useParameter() as NumericParameterModel;

    const onChange = (v: number) => {
       store.gp200.changeParamValue(store.gp200.current_effect.type, param.id, v);
       console.log(`Numeric assign value (${param.name})= ${v}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.paramName}>{param.name}</Text>
                <Text>{param.getStringValue()}</Text>
            </View>
            <Slider
                //style={{maxWidth:200, height:40}}
                style={styles.controlContainer}
                minimumValue={param.min_value[0]}
                maximumValue={param.max_value[0]}
                step={param.step_size[0]}
                value={param.current_value[0]}
                onValueChange={onChange}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        flexDirection: 'column',
        paddingVertical: 10,
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


export default observer(NumericParameter);