import { NumericParameterModel } from "@/models/parameter/numericParameter";
//import Slider from "@react-native-community/slider";
import NumericSlider from "@/components/NumericSlider";
import { observer } from "mobx-react-lite";

type NumericParameterProps = {
    param: NumericParameterModel
    onChange: (n: number) => void;
}

function NumericParameter({param, onChange}: NumericParameterProps) {

    const onNumericChange = (n: number) => {
       param.setValue(n);
       onChange(n);
    };

    return (
        <NumericSlider 
            name={param.name}
            shownValue={param.getStringValue()}
            minValue={param.min_value[0]}
            maxValue={param.max_value[0]}
            step={param.step_size[0]}
            currentValue={param.current_value[0]}
            onChange={ onChange ?? onNumericChange }
        />
    );
}

export default observer(NumericParameter);