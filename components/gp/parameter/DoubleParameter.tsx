import NumericSlider from "@/components/NumericSlider";
import PickerSelector from "@/components/pickerSelector";
import { useScrolling } from "@/contexts/scroll-context";
import { DoubleParameterModel } from "@/models/parameter/doubleParameter";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";

type DoubleParameterProps = {
    param:DoubleParameterModel 
}

function DoubleParameter({param}: DoubleParameterProps) {

    const { enableScrolling, disableScrolling} = useScrolling();

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
                    onSlidingStart={(_) => {
                        disableScrolling();
                    }}
                    onSlidingComplete={(n:number) => {
                        enableScrolling();
                        store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
                    }}
                />
            }
            {
                isSecondRangeActive &&
                <PickerSelector
                    name={param.name}
                    currentValue={param.current_value[1].toString()}
                    labels={labels}
                    onChange={(_: string, n: number) => {
                        store.gpActions.ChangeEffectParamValue(param.id, param.type[0], n);
                    }}
                />
            }
        </>
    );
}

export default observer(DoubleParameter);