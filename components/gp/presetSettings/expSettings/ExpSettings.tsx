import NumericSlider from "@/components/NumericSlider";
import PickerSelector from "@/components/pickerSelector";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { DoubleParameterModel } from "@/models/parameter/doubleParameter";
import { IParameter } from "@/models/parameter/IParameter";
import { ExpModule } from "@/models/preset/IExpSettings";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

const MODULE_LABELS: [string, string][] = Object.entries(ExpModule)
  .filter(([key, value]) => typeof value === 'number') // Filter out the reverse mappings (numeric keys)
  .map(([key, value]) => ( [value.toString(), key ]) );
  
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
    switch (module) {
        case ExpModule.OFF:
            return undefined;
        default:
            // get params in module
            if (store.gp200.currentPreset) {
                console.log("Get Param type",store.gp200.currentPreset.effects[module as number].type);
                // get param with given id
                return store.gp200.currentPreset.effects[module as number].parameters
                .find(p => p.id === paramID)
            } else {
                return undefined;
            }
    }
}

function GetParamRange(module: ExpModule, paramID: number): [number, number, number]{
    const DefaultRange: [number, number, number] = [0, 100, 1];

    if (store.gp200.currentPreset == undefined) {return DefaultRange;}

    switch (module) {
        case ExpModule.OFF:
            return DefaultRange;
        default:
            //console.log("Effect module Type:", store.gp200.currentPreset.effects[module as number].type);
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
    const expModule = store.gp200.currentPreset.exps[expID][expParamID].module;
    const expParam = store.gp200.currentPreset.exps[expID][expParamID].paramNumber;
    const currentParamMin = store.gp200.currentPreset.exps[expID][expParamID].moduleParamNumberMin;
    const currentParamMax = store.gp200.currentPreset.exps[expID][expParamID].moduleParamNumberMax;

    console.log("ExpModule:", expModule, "ExpParam:", expParam, "ExpParamMin:", currentParamMin, "ExpParamMax:", currentParamMax);

    // Get ranges of value
    const paramRange = GetParamRange(expModule, expParam);
    console.log("param Default Range", paramRange);
    const [paramMin, paramMax, paramStep] = paramRange;


    // Show correct param value
    // const getStringValue = useCallback( (n: number): string => {
    //     const param = GetParam(expModule, expParam);

    //     if (param == undefined) return n.toString();

    //     if (param.type == "Double") {
    //         const q = param as DoubleParameterModel;
    //         if (q.current_range_idx !== 0 && n in param.labels) {
    //             return param.labels[n];
    //         } else {
    //             return `${n} ${param.units}` 
    //         }
    //     } else if (param.type == "Numeric") {
    //         if (n in param.labels) {
    //             return param.labels[n];
    //         } else {
    //             return `${n} ${param.units}` 
    //         }
    //     } else {
    //         return param.labels[n];
    //     }
    // }, [expModule, expParam]);

    const param = GetParam(expModule, expParam);
    const getStringValue = useCallback( (n: number): string => {
        //const param = GetParam(expModule, expParam);

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
                        const [min, max, step]= GetParamRange(module, paramID);
                        //console.log("Range",min, max, step);
                        store.gpActions.ChangePresetExpSettings(expID, expParamID,
                            module, paramID, min, max);
                    }
                }}
            />
            <PickerSelector name={"Parameter"}
                currentValue={expParam.toString()}
                labels={GetParamLabels(expModule)}
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
                currentValue={currentParamMin}
                onChange={function (n: number): void {
                    console.log("Change Exp Param Min value:", n);
                    store.gpActions.ChangePresetExpSettings(expID, expParamID,
                        expModule, expParam, n, currentParamMax);
                }}
            />
            <NumericSlider
                name={"Param Max"}
                shownValue={getStringValue}
                minValue={paramMin}
                maxValue={paramMax}
                step={paramStep}
                currentValue={currentParamMax}
                onChange={function (n: number): void {
                    console.log("Change Exp Param Max value:", n);
                    store.gpActions.ChangePresetExpSettings(expID, expParamID,
                        expModule, expParam, currentParamMin, n);
                }}
            />
            </>
            }
        </VStack>
    );
}

export default observer(ExpSettings);