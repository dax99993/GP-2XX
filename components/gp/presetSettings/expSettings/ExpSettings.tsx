import PickerSelector from "@/components/pickerSelector";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { IParameter } from "@/models/parameter/IParameter";
import { ExpModule } from "@/models/preset/IExpSettings";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import ExpParamSetter from "./ExpParamSetter";

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
                console.log(store.gp200.currentPreset.effects[module as number].type);
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

interface ExpParam {
    minValue: number,
    maxValue: number,
    step: number, //only for numeric
    labels: [string, string][],
}

function GetParam(module: ExpModule, paramID: number): IParameter | undefined {
    switch (module) {
        case ExpModule.OFF:
            return undefined;
        default:
            // get params in module
            if (store.gp200.currentPreset) {
                console.log(store.gp200.currentPreset.effects[module as number].type);
                return store.gp200.currentPreset.effects[module as number].parameters
                .find(p => p.id == paramID)
            } else {
                return undefined;
            }
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

    console.log(expModule, expParam, currentParamMin, currentParamMax);

    // Get ranges of value
    const param = GetParam(expModule, expParam);
    console.log("param", param);

    const paramMin = param?.getMinValue();
    const paramMax = param?.getMaxValue();
    console.log("Module min and max", paramMin, paramMax);

    return (
        <VStack space="lg">
            <PickerSelector name={"Module"}
                currentValue={expModule.toString()}
                labels={MODULE_LABELS}
                onChange={function (s: string, n: number): void {
                    console.log("selected EXP Module", s, n);
                    if (store.gp200.currentPreset){
                        // have to check what is the first paramID in effect! (not always 0)
                        // Get minimum and maximum of current effect to set them
                        const module = parseInt(s) as ExpModule;
                        //const [min, max] = GetParamRange(module)[0];
                        store.gpActions.ChangePresetExpSettings(expID, expParamID,
                            module, 0, 0, 100);
                    }
                }}
            />
            <PickerSelector name={"Param Name"}
                currentValue={expParam.toString()}
                labels={GetParamLabels(expModule)}
                onChange={function (s: string, n: number): void {
                    console.log("selected EXP Param", s, n);
                    if (store.gp200.currentPreset){
                        const moduleParamID = parseInt(s);
                        const param = GetParam(expModule, expParam);
                        const min = param?.getMinValue() ?? 0;
                        const max = param?.getMaxValue() ?? 100;
                        console.log(min, max);
                        store.gpActions.ChangePresetExpSettings(expID, expParamID,
                            expModule, moduleParamID, min, max);
                    }
                }}
            />
            <Divider/>
            {param != undefined &&
            <>
            <ExpParamSetter
                name={"Param Min"}
                minValue={paramMin ?? 0}
                maxValue={paramMax ?? 100}
                step={1}
                currentValue={currentParamMin}
                onNumericChange={function (n: number): void {
                    console.log("Change value:", n);
                    store.gpActions.ChangePresetExpSettings(expID, expParamID,
                        expModule, expParam, n, currentParamMax);
                }}
            />
            <ExpParamSetter
                name={"Param Max"}
                minValue={paramMin ?? 0}
                maxValue={paramMax ?? 100}
                step={1}
                currentValue={currentParamMax}
                onNumericChange={function (n: number): void {
                    console.log("Change value:", n);
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