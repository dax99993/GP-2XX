import { SelectParameterModel } from "@/models/parameter/selectParameter";
import { store } from "@/models/store";
import { Picker } from "@react-native-picker/picker";
import { observer } from "mobx-react-lite";
import { Switch, Text } from "react-native";
import { useParameter } from "./Parameter";


function SelectParameter() {
    const param = useParameter() as SelectParameterModel;

    const onChangeBoolean = (v: boolean) => {
        const n: number = v ? 1 : 0;
        store.gp200.changeParamValue(param.name, n);
        console.log(`Numeric assign value (${param.name})= ${v}`);
    };

    const onChangeNumber = (v:string, n: number) => {
       store.gp200.changeParamValue(param.name, n);
       console.log(`Select assign value (${param.name})= ${v}, ${n}`);
    };

    const labelEntries = Object.entries(param.labels);
    //console.log("Select labels = ", labelEntries);

    const pickerItems = labelEntries.map(e => (
        <Picker.Item key={e[0]} value={e[0]} label={e[1]}/>
    ));

    return (
        <>
            <Text>{`${param.name} - ${param.getStringValue()}`}</Text>
            {
            Object.keys(param.labels).length === 2 &&
            <Switch
                value={param.current_value[0] !== 0}
                onValueChange={onChangeBoolean}
            />
            }
            {
            Object.keys(param.labels).length > 2 &&
                <Picker 
                    mode="dropdown"
                    selectedValue={param.current_value[0].toString()}
                    onValueChange={onChangeNumber}
                >
                    {
                        pickerItems
                    }
                </Picker>
            }
        </>
    );
}

export default observer(SelectParameter);