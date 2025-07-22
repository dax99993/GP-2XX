import { SelectParameterModel } from "@/models/parameter/selectParameter";
import { store } from "@/models/store";
import { Picker } from "@react-native-picker/picker";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";

type SelectParameterProps = {
    param: SelectParameterModel
}

function SelectParameter({param}: SelectParameterProps) {

    const onChangeNumber = (v:string, n: number) => {
       //store.gp200.changeParamValue(param.name, n);
       store.gp200.changeParamValue(store.gp200.current_effect.type, param.id, n);
       console.log(`Select assign value (${param.name})= ${v}, ${n}`);
    };

    const labelEntries = Object.entries(param.labels);
    //console.log("Select labels = ", labelEntries);

    const pickerItems = labelEntries.map(e => (
        <Picker.Item key={e[0]} value={e[0]} label={e[1]}/>
    ));

    return (
        <View style={styles.container}>
            <Text style={styles.infoContainer}>{param.name}</Text>
            {
                <Picker style={styles.controlContainer}
                    mode="dropdown"
                    selectedValue={param.current_value[0].toString()}
                    onValueChange={onChangeNumber}
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
        flex:1,
        flexDirection: 'column',
        backgroundColor: 'pink',
        paddingVertical: 10,
        //marginHorizontal: 10,
    },
    infoContainer: {
        marginLeft: 15,
        fontSize: 16,
        fontWeight: 'bold',
    },
    controlContainer: {
        marginLeft: 15,
        marginRight: 30,
    }
});

export default observer(SelectParameter);