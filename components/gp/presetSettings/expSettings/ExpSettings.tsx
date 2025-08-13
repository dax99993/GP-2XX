import NumericSlider from "@/components/NumericSlider";
import PickerSelector from "@/components/pickerSelector";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { DoubleParameterModel } from "@/models/parameter/doubleParameter";
import { IParameter } from "@/models/parameter/IParameter";
import { ExpModule } from "@/models/preset/IExpSettings";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";

const MODULE_LABELS: [string, string][] = Object.entries(ExpModule)
  .filter(([key, value]) => typeof value === 'number') // Filter out the reverse mappings (numeric keys)
  .map(([key, value]) => ( [value.toString(), key ]) );
  

// This can be shorten by using param as input and memoing
function GetParamLabels(module: ExpModule): [string, string][] {
    switch (module) {
        case ExpModule.OFF:
            return [["0", "OFF"]];
        default:
            // get params in module
            if (store.gp200.currentPreset) {
                console.log("Get Param Labels", store.gp200.currentPreset.effects[module as number].type);
                const l: [string, string][] = store.gp200.currentPreset.effects[module as number]
                .parameters.map(
                    p => {
                        return [p.id.toString(), p.name]
                    }
                )
                return l;
            } else {
                return [["0", "OFF"]]
            }
    }
}

function GetParam(module: ExpModule, paramID: number): IParameter | undefined {
    if (store.gp200.currentPreset == undefined) {return undefined;}

    switch (module) {
        case ExpModule.OFF:
            return undefined;
        default:
            // get params in module
            console.log("Get Param",store.gp200.currentPreset.effects[module as number].type);
            // get param with given id
            return store.gp200.currentPreset.effects[module as number].parameters
                .find(p => p.id === paramID)
    }
}

function GetParamRange(module: ExpModule, paramID: number): [number, number, number]{
    const DefaultRange: [number, number, number] = [0, 100, 1];

    if (store.gp200.currentPreset == undefined) {return DefaultRange;}

    switch (module) {
        case ExpModule.OFF:
            return DefaultRange;
        default:
            console.log("Get Param Range:", store.gp200.currentPreset.effects[module as number].type);
            // get param with given id
            let p = store.gp200.currentPreset.effects[module as number].parameters
                .find(p => p.id === paramID);

            return p != undefined ? [p.getMinValue(), p.getMaxValue(), p.getCurrentStep()] : DefaultRange;
    }
}

interface ExpSettingsProps {
    expID: number;
    expParamID: number;
}


function ExpSettings({expID, expParamID }: ExpSettingsProps) {
    if (store.gp200.currentPreset == undefined) {return null};

    console.log("ExpID", expID, "paramID", expParamID);

    // Store values required for expSettings
    const expModule = store.gp200.currentPreset.exps[expID][expParamID].module;
    const expParam = store.gp200.currentPreset.exps[expID][expParamID].paramNumber;
    const currentParamMin = store.gp200.currentPreset.exps[expID][expParamID].moduleParamNumberMin;
    const currentParamMax = store.gp200.currentPreset.exps[expID][expParamID].moduleParamNumberMax;

    console.log("ExpModule:", expModule, "ExpParam:", expParam, "ExpParamMin:", currentParamMin, "ExpParamMax:", currentParamMax);


    // Parameter info used for setting info
    const PARAM_LABELS: [string, string][] = useMemo(()=>{
        return GetParamLabels(expModule);
    }, [expModule]);

    const paramRange = useMemo(() => 
        GetParamRange(expModule, expParam),
    [expModule, expParam]);

    const param = useMemo(() =>
        GetParam(expModule, expParam),
    [expModule, expParam]);


    // Slider values to show correct info
    const [min, setMin] = useState(currentParamMin);
    // Prevent flicker in value
    useEffect(()=> {
        //console.log("Setting min", currentParamMin);
        if (min != currentParamMin) {
            setMin(currentParamMin)
        }
    }, [currentParamMin]);

    const [max, setMax] = useState(currentParamMax);
    useEffect(()=> {
        //console.log("Setting max", currentParamMax);
        if (max != currentParamMax) {
            setMax(currentParamMax)
        }
    }, [currentParamMax]);

    // Get ranges of value
    console.log("param Default Range", paramRange);
    const [paramMin, paramMax, paramStep] = paramRange;

    // Get correct value to show as current slider value
    const getStringValue = useCallback( (n: number): string => {
        if (param == undefined) return n.toString();

        if (param.type == "Double") {
            const q = param as DoubleParameterModel;
            if (q.current_range_idx !== 0 && n in param.labels) {
                return param.labels[n];
            } else {
                return `${n} ${param.units}` 
            }
        } else if (param.type == "Numeric") {
            if (n in param.labels) {
                return param.labels[n];
            } else {
                return `${n} ${param.units}` 
            }
        } else {
            return param.labels[n];
        }
    }, [param]);


    return (
        <VStack space="lg">
            <PickerSelector name={"Module"}
                currentValue={expModule.toString()}
                labels={MODULE_LABELS}
                onChange={function (s: string, n: number): void {
                    if (store.gp200.currentPreset){
                        const module = parseInt(s) as ExpModule;
                        // All effects except CAB have a parameter with ID 0
                        const paramID = module == ExpModule.CAB ? 1 : 0;
                        //console.log("Set EXP MODULE ", s, "paramID", paramID);
                        // Get range of current effect to set them
                        const [min, max, _] = GetParamRange(module, paramID);
                        //console.log("Range",min, max, step);
                        store.gpActions.ChangePresetExpSettings(expID, expParamID,
                            module, paramID, min, max);
                    }
                }}
            />
            <PickerSelector name={"Parameter"}
                currentValue={expParam.toString()}
                labels={PARAM_LABELS}
                onChange={function (s: string, n: number): void {
                    if (store.gp200.currentPreset){
                        const moduleParamID = parseInt(s);
                        //console.log("Set EXP MODULE ", expModule, moduleParamID);
                        const [min, max, _]= GetParamRange(expModule, moduleParamID);
                        //console.log("Ranges: ", min, max, step);
                        store.gpActions.ChangePresetExpSettings(expID, expParamID,
                            expModule, moduleParamID, min, max);
                    }
                }}
            />
            <Divider/>
            {expModule != ExpModule.OFF &&
            <>
            <NumericSlider
                key={currentParamMin}
                name={"Param Min"}
                shownValue={getStringValue}
                minValue={paramMin}
                maxValue={paramMax}
                step={paramStep}
                currentValue={min}
                onChange={function (n: number): void {
                    console.log("Change Exp Param Min value:", n);
                    setMin(n);
                    store.gpActions.ChangePresetExpSettings(expID, expParamID,
                        expModule, expParam, n, max);
                }}
            />
            <NumericSlider
                name={"Param Max"}
                shownValue={getStringValue}
                minValue={paramMin}
                maxValue={paramMax}
                step={paramStep}
                currentValue={max}
                onChange={function (n: number): void {
                    console.log("Change Exp Param Max value:", n);
                    setMax(n);
                    store.gpActions.ChangePresetExpSettings(expID, expParamID,
                        expModule, expParam, min, n);
                }}
            />
            </>
            }
        </VStack>
    );
}

export default observer(ExpSettings);