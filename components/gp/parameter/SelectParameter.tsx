import PickerSelector from "@/components/pickerSelector";
import { SelectParameterModel } from "@/models/parameter/selectParameter";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";

type SelectParameterProps = {
    param: SelectParameterModel
}

function SelectParameter({param}: SelectParameterProps) {

    const onChange = (v:string, n: number) => {
       store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
       console.log(`Select assign value (${param.name})= ${v}, ${n}`);
    };

    const labelEntries = Object.entries(param.labels);
    console.log("Select labels = ", labelEntries);

    return (
        <PickerSelector
            name={param.name}
            currentValue={param.current_value[0].toString()}
            labels={labelEntries}
            onChange={onChange}
        />
    );
}

// function SelectParameter({param}: SelectParameterProps) {

//     const labelEntries = Object.entries(param.labels);
//     console.log("Select labels = ", labelEntries);

//     const onChange = (v: string) => {
//        const n = Number.parseInt(v);

//        store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
//        console.log(`Select assign value (${param.name})= ${v}, ${n}`);
//     };

//     return (
//         <ActionSheetSelector
//             name={param.name}
//             placeholder={param.getStringValue()}
//             labels={labelEntries}
//             onChange={onChange}
//         />
//     );
// }

export default observer(SelectParameter);