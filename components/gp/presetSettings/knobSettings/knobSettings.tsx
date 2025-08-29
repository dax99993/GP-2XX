import PickerSelector from "@/components/pickerSelector";
import { KnobModule } from "@/models/preset/IKnobSettings";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import React from "react";

const MODULE_LABELS: [string, string][] = Object.entries(KnobModule)
  .filter(([key, value]) => typeof value === 'number') // Filter out the reverse mappings (numeric keys)
  .map(([key, value]) => ( [value.toString(), key ]) );


interface KnobSettingsProps {
    knobID: number
}

function GetParamLabels(module: KnobModule): [string, string][] {
    switch (module) {
        case KnobModule.BPM:
        case KnobModule.PATCHVOL:
        case KnobModule.OFF:
            return [["0", "OFF"]];
        default:
            // get params in module
            if (store.gp200.currentPreset) {
                console.log(store.gp200.currentPreset.effects[module as number].type);
                const l: [string, string][] = store.gp200.currentPreset.effects[module as number]
                .parameters.map(
                    p => {
                        return [p.ID.toString(), p.name]
                    }
                )
                return l;
            } else {
                return [["0", "OFF"]]
            }
    }
}

function KnobSettings({knobID}: KnobSettingsProps) {
    if (store.gp200.currentPreset == undefined) {return null};

    // Get param names of modules
    const knobModule = store.gp200.currentPreset?.knobs[knobID].module;
    const knobValue = store.gp200.currentPreset?.knobs[knobID].paramID;
    const param_labels = GetParamLabels(knobModule);
    console.log("KnobSettings", knobID, knobModule, knobValue, param_labels);

    return (
        <>
            <PickerSelector name={"Module"}
                currentValue={knobModule.toString()}
                labels={MODULE_LABELS}
                onChange={function (s: string, n: number): void {
                    console.log("selected Knob Module", s, n);
                    store.gpActions.ChangePresetKnobSettings(knobID, parseInt(s) as KnobModule);
                }}
            />
            <PickerSelector name={"Param Name"}
                currentValue={knobValue?.toString()}
                labels={param_labels}
                onChange={function (s: string, n: number): void {
                    console.log("selected Knob Param", s, n);
                    store.gpActions.ChangePresetKnobSettings(knobID, knobModule, parseInt(s));
                }}
            />
        </>
    );
}

export default observer(KnobSettings);