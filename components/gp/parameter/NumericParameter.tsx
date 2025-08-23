import { NumericParameterModel } from "@/models/parameter/numericParameter";
import { store } from "@/models/store";
//import Slider from "@react-native-community/slider";
import NumericSlider from "@/components/NumericSlider";
import { useScrolling } from "@/contexts/scroll-context";
import { observer } from "mobx-react-lite";

type NumericParameterProps = {
    param: NumericParameterModel
}

function NumericParameter({param}: NumericParameterProps) {

    const { enableScrolling, disableScrolling} = useScrolling();

    const getStringValue = (n: number): string => {
        if (param == undefined) return "";
        if (n in param.labels) {
            return param.labels[n];
        } else {
            return `${n} ${param.units}` 
        }
    }

    return (
        <NumericSlider 
            name={param.name}
            shownValue={getStringValue}
            minValue={param.min_value[0]}
            maxValue={param.max_value[0]}
            step={param.step_size[0]}
            currentValue={param.current_value[0]}
            onSlidingStart={(_) => {
                disableScrolling();
            }}
            onSlidingComplete={(n: number) => {
                enableScrolling();
                store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
            }}
        />
    );
}

export default observer(NumericParameter);