import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import EffectImage from "../../effect/EffectImage";

const DATA = ["PRE", "WAH", "DST", "AMP", "NR", "CAB", "EQ", "MOD", "DLY", "RVB", "VOL"];

interface CtrlSettingsProps {
    ctrlID: number;
}

function CtrlSettings({ctrlID}: CtrlSettingsProps) {
    if (store.gp200.currentPreset == undefined) {return null};

    const effects = store.gp200.currentPreset.effects;
    const pedals = store.gp200.currentPreset.ctrls[ctrlID].pedalsAssign;
    //console.log(ctrlID, pedals);

    const renderItem = useCallback((item: string)  => {
        const index = DATA.indexOf(item);
        const selected = index !== -1 ? pedals[index] != 0 : false;
        const state = index !== -1 ? effects[index].state : false;
        //console.log(index, state, selected);

        const changeBinding = () => {
            let newPedalBinding: number[] = [...pedals];
            newPedalBinding[index] = 1 - newPedalBinding[index];
            //console.log(newPedalBinding);
            store.gpActions.ChangePresetCtrlSettings(ctrlID, newPedalBinding);
        };

        return (
            <TouchableOpacity key={item} onPress={changeBinding} style={{alignItems: 'center'}}>
                <Center style={{ width: 50, height: 50 }}>
                        <EffectImage type={item} state={state} selected={selected}/>
                </Center>
            </TouchableOpacity>
        );
    }, [pedals, effects]);

    return (
        <Center>
            <VStack space="md">
                <HStack space="md">
                    { DATA.slice(0, 6).map(s => renderItem(s))}
                </HStack>
                <HStack space="md">
                    { DATA.slice(6).map(s => renderItem(s))}
                </HStack>
            </VStack>
        </Center>
    );
}

export default observer(CtrlSettings);