import NumericSlider from "@/components/NumericSlider";
import PickerSelector from "@/components/pickerSelector";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { useScrolling } from "@/contexts/scroll-context";
import { useStore } from "@/hooks/useStore";
import { IParameter, ParamType } from "@/models/parameter/IParameter";
import { Switch } from "@/models/parameter/Switch";
import { ExpModule } from "@/models/preset/IExpSettings";
import { Store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";

const MODULE_LABELS: [string, string][] = Object.entries(ExpModule)
  .filter(([key, value]) => typeof value === 'number') // Filter out the reverse mappings (numeric keys)
  .map(([key, value]) => ( [value.toString(), key ]) );
  

// This can be shorten by using param as input and memoing
function GetParamLabels(store: Store, module: ExpModule): [string, string][] {
    if (store.gp200.currentPreset == null) {
        return [["0", "OFF"]];
    }

    switch (module) {
        case ExpModule.OFF:
            return [["0", "OFF"]];
        default:
            // get params in module
            console.log("Get Param Labels", store.gp200.currentPreset.effects[module as number].type);

            const l: [string, string][] = store.gp200.currentPreset.effects[module as number]
                .parameters.map(
                    p => {
                        return [p.ID.toString(), p.name]
                    }
                )

            // Remove duplicates
            const removeDuplicateLists = (listOfLists: [any, any][]) => {
                const uniqueStrings = new Set<string>();
                const result: [any, any][] = [];

                for (const list of listOfLists) {
                    const listString = JSON.stringify(list);
                    if (!uniqueStrings.has(listString)) {
                        uniqueStrings.add(listString);
                        result.push(list);
                    }
                }
                return result;
            }

            return removeDuplicateLists(l);
    }
}

function GetParam(store: Store, module: ExpModule, paramID: number): IParameter | undefined {
    if (store.gp200.currentPreset == undefined) {return undefined;}

    switch (module) {
        case ExpModule.OFF:
            return undefined;
        default:
            console.log("Get Params of Module",store.gp200.currentPreset.effects[module as number].type);

            // Search for a switch parameter with non-null bind
            const s = store.gp200.currentPreset.effects[module as number].parameters
                .find(p => p.type === ParamType.Switch);
            
            const hasDoubleParam = s instanceof Switch && s.bind == paramID;

            // Get param with given id and appropiate type
            if (hasDoubleParam && s.getValue() == 0) {
                console.log("PARAM WITH BINDING SLIDER");
                return store.gp200.currentPreset.effects[module as number].parameters
                    .find(p => p.ID === paramID && p.type !== ParamType.Combox);
            } else if (hasDoubleParam && s.getValue() != 0) {
                console.log("PARAM WITH BINDING COMBOX");
                return store.gp200.currentPreset.effects[module as number].parameters
                    .find(p => p.ID === paramID && p.type === ParamType.Combox);
            } else {
                // console.log("PARAM WITHOUT BINDING");
                return store.gp200.currentPreset.effects[module as number].parameters
                    .find(p => p.ID === paramID)
            }

    }
}

function GetParamRange(store: Store, module: ExpModule, paramID: number): [number, number, number]{
    const DefaultRange: [number, number, number] = [0, 100, 1];

    if (store.gp200.currentPreset == undefined) {return DefaultRange;}

    switch (module) {
        case ExpModule.OFF:
            return DefaultRange;
        default:
            console.log("Get Param Range:", store.gp200.currentPreset.effects[module as number].type);
            // Get param with given id
            const p = GetParam(store, module, paramID);
            console.log("param name and id", p?.name, p?.ID, p?.type);

            return p != undefined ? [p.getMinValue(), p.getMaxValue(), p.getCurrentStep()] : DefaultRange;
    }
}

interface ExpSettingsProps {
    expID: number;
    expParamID: number;
}

function ExpSettings({expID, expParamID }: ExpSettingsProps) {
    const store = useStore();
    const { enableScrolling, disableScrolling} = useScrolling();

    if (store.gp200.currentPreset == undefined) {return null};

    console.log("ExpID", expID, "paramID", expParamID);

    // Store values required for expSettings
    const expModule = store.gp200.currentPreset.exps[expID][expParamID].module;
    const expParam = store.gp200.currentPreset.exps[expID][expParamID].paramNumber;
    const currentParamMin = store.gp200.currentPreset.exps[expID][expParamID].moduleParamNumberMin;
    const currentParamMax = store.gp200.currentPreset.exps[expID][expParamID].moduleParamNumberMax;
    const bindParameter = expModule == ExpModule.OFF ? 0 : store.gp200.currentPreset.effects[expModule].activeBindParams.length;

    console.log("ExpModule:", expModule, "ExpParam:", expParam, "ExpParamMin:", currentParamMin, "ExpParamMax:", currentParamMax);

    // Parameter info used for setting info
    const PARAM_LABELS: [string, string][] = useMemo(()=>{
        return GetParamLabels(store, expModule);
    }, [expModule]);

    const param = useMemo(() => {
        console.log("Bind parameter", bindParameter);
        return GetParam(store, expModule, expParam)
    }, [expModule, expParam, bindParameter]);

    // Get correct value to show as current slider value
    const getStringValue = useCallback( (n: number): string => {
        if (param == undefined) return n.toString();
        return param.getValueAsString(n);
    }, [param]);

    const paramRange = useMemo(() => {
        console.log("Bind parameter", bindParameter);
        return GetParamRange(store, expModule, expParam);
    }, [expModule, expParam, bindParameter]);

    // Get ranges of value
    const [paramMin, paramMax, paramStep] = paramRange;
    console.log("Param Range", paramRange);


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
                        const [min, max, _] = GetParamRange(store, module, paramID);
                        //console.log("Range",min, max, step);
                        store.gpMidiEncoder.ChangePresetExpSettings(expID, expParamID,
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
                        const [min, max, _]= GetParamRange(store, expModule, moduleParamID);
                        //console.log("Ranges: ", min, max, step);
                        store.gpMidiEncoder.ChangePresetExpSettings(expID, expParamID,
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
                onSlidingStart={(_) => {
                    disableScrolling();
                }}
                onSlidingComplete={function (n: number): void {
                    console.log("Change Exp Param Min value:", n);
                    enableScrolling();
                    setMin(n);
                    store.gpMidiEncoder.ChangePresetExpSettings(expID, expParamID,
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
                onSlidingStart={(_) => {
                    disableScrolling();
                }}
                onSlidingComplete={function (n: number): void {
                    console.log("Change Exp Param Max value:", n);
                    enableScrolling();
                    setMax(n);
                    store.gpMidiEncoder.ChangePresetExpSettings(expID, expParamID,
                        expModule, expParam, min, n);
                }}
            />
            </>
            }
        </VStack>
    );
}

export default observer(ExpSettings);