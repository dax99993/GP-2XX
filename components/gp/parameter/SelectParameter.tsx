import PickerSelector from "@/components/pickerSelector";
import { Combox } from "@/models/parameter/Combox";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";

type SelectParameterProps = {
    param: Combox
}

function SelectParameter({param}: SelectParameterProps) {

    const onChange = (v:string, n: number) => {
       store.gpMidiEncoder.ChangeEffectParamValue(param.ID, "float", n);
       console.log(`Select assign value (${param.name})= ${v}, ${n}`);
    };

    const labelEntries: [string, string][] = param.data.map((menu) => {
        return [menu.ID.toString(), menu.name];
    });

    console.log("Select labels = ", labelEntries);

    return (
        <PickerSelector
            name={param.name}
            currentValue={param.currentValue.toString()}
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