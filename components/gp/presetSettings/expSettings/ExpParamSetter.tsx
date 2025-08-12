import NumericSlider from "@/components/NumericSlider";

interface Props {
    name: string;
    minValue: number; 
    maxValue: number; 
    step: number;
    currentValue: number;
    onNumericChange: (n: number) => void;
    //onSelectChange: (s: string, n: number) => void;
}

function ExpParamSetter(props: Props) {
    return (
        <>
            <NumericSlider 
                name={props.name}
                minValue={props.minValue}
                maxValue={props.maxValue}
                step={props.step}
                currentValue={props.currentValue}
                onChange={props.onNumericChange}
            />
        </>
    );
}


export default ExpParamSetter;