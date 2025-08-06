import { NumericParameterModel } from "@/models/parameter/numericParameter";
import { store } from "@/models/store";
//import Slider from "@react-native-community/slider";
import NumericSlider from "@/components/NumericSlider";
import { observer } from "mobx-react-lite";

type NumericParameterProps = {
    param: NumericParameterModel
}

function NumericParameter({param}: NumericParameterProps) {

    const onChange = (n: number) => {
       store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
       console.log(`Numeric assign value (${param.name})= ${n}`);
    };

    return (
        <NumericSlider 
            name={param.name}
            shownValue={param.getStringValue()}
            minValue={param.min_value[0]}
            maxValue={param.max_value[0]}
            step={param.step_size[0]}
            currentValue={param.current_value[0]}
            onChange={ onChange }
        />
    );
}

export default observer(NumericParameter);