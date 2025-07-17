import { NumericParameterModel } from "@/models/parameter/numericParameter";
import { store } from "@/models/store";
import Slider from "@react-native-community/slider";
import { observer } from "mobx-react-lite";
import { Text } from "react-native";
import { useParameter } from "./Parameter";



function NumericParameter() {

    const param = useParameter() as NumericParameterModel;

    const onChange = (v: number) => {
       store.gp200.changeParamValue(param.name, v);
       console.log(`Numeric assign value (${param.name})= ${v}`);
    };

    return (
        <>
            <Text>{`${param.name} - ${param.getStringValue()}`}</Text>
            <Slider
                //style={{width:200, height:40}}
                minimumValue={param.min_value[0]}
                maximumValue={param.max_value[0]}
                step={param.step_size[0]}
                value={param.current_value[0]}
                onValueChange={onChange}
            />
        </>
    );
}


export default observer(NumericParameter);