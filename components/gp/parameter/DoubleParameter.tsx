import NumericSlider from "@/components/NumericSlider";
import PickerSelector from "@/components/pickerSelector";
import { DoubleParameterModel } from "@/models/parameter/doubleParameter";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";

type DoubleParameterProps = {
    param:DoubleParameterModel 
}

function DoubleParameter({param}: DoubleParameterProps) {

    const onChangeNumeric = (n: number) => {
       store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
    };

    const onChangeSelect = (v:string, n: number) => {
        store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
    };

    const isSecondRangeActive = param.current_range_idx !== 0;

    const getStringValue = (n: number): string => {
        if (param == undefined) return "";

        if (!isSecondRangeActive){
            console.log("second range active?", isSecondRangeActive);
            // double params never use labels on numeric range
            return `${n} ${param.units}` 
        }

        return "";
    }

    const labels = Object.entries(param.labels);

    return (
        <>
            {
                !isSecondRangeActive &&
                <NumericSlider
                    name={param.name}
                    shownValue={getStringValue}
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