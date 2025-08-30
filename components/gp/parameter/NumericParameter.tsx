import { store } from "@/models/store";
//import Slider from "@react-native-community/slider";
import NumericSlider from "@/components/NumericSlider";
import { useScrolling } from "@/contexts/scroll-context";
import { IParameter } from "@/models/parameter/IParameter";
import { observer } from "mobx-react-lite";

type NumericParameterProps = {
    param: IParameter
}

function NumericParameter({param}: NumericParameterProps) {

    const { enableScrolling, disableScrolling} = useScrolling();

    const getStringValue = param.getValueAsString.bind(param);

    return (
        <NumericSlider 
            name={param.name}
            shownValue={getStringValue}
            minValue={param.min}
            maxValue={param.max}
            step={param.step}
            currentValue={param.currentValue}
            onSlidingStart={(_) => {
                disableScrolling();
            }}
            onSlidingComplete={(n: number) => {
                enableScrolling();
                store.gpActions.ChangeEffectParamValue(param.ID, "float", n);
            }}
        />
    );
}

export default observer(NumericParameter);