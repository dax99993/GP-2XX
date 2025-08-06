import NumericSlider from "@/components/NumericSlider";
import PickerSelector from "@/components/pickerSelector";
import { DoubleParameterModel } from "@/models/parameter/doubleParameter";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";

type DoubleParameterProps = {
    param:DoubleParameterModel 
}

function DoubleParameter({param}: DoubleParameterProps) {

    const isSecondRangeActive = param.current_range_idx === 1;
    //console.log("second range activated? = ", isSecondRangeActive);

    const onChangeNumeric = (n: number) => {
       //store.gp200.changeParamValue(store.gp200.current_effect.type, param.id, v);
       store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
       //console.log("Numeric new value = ", v);
       //console.log(`Numeric assign value (${param.name})= ${n}`);
    };

    const onChangeSelect = (v:string, n: number) => {
        //console.log("param picker new value = ", v, n);
        store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
        //console.log(`Select assign value (${param.name}) = ${n}, ${v}`);
    };

    const labels = Object.entries(param.labels);

    return (
        <>
            {
                !isSecondRangeActive &&
                <NumericSlider
                    name={param.name}
                    shownValue={param.getStringValue()}
                    minValue={param.min_value[0]}
                    maxValue={param.max_value[0]}
                    step={param.step_size[0]}
                    currentValue={param.current_value[0]}
                    onChange={onChangeNumeric}
                />
            }
            {
                isSecondRangeActive &&
                <PickerSelector
                    name={param.name}
                    currentValue={param.current_value[1].toString()}
                    labels={labels}
                    onChange={onChangeSelect} 
                />
            }
        </>
    );
}

export default observer(DoubleParameter);