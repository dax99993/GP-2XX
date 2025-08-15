import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";

import { store } from "@/models/store";
import SavePresetForm from "../gp/preset/SavePresetForm";
import MyModal from "./Modal";


function SaveModal() {
    const headerTitle = "Save Preset";

    const onClose = () => {
        store.modals.closeModal("savePresetModal");
    }

    const onSave = (presetNumber: number, presetName: string) => {
        console.log("Save preset", presetNumber, "with name:", presetName);
        // Save preset
        store.gpActions.SaveCurrentPreset(presetNumber, presetName);

        // Go to new saved preset
        store.gpActions.ChangePreset(presetNumber);

        // CloseModal
        onClose();
    }

    const PRESET_LABELS: [string, string][] = store.gp200.presets.map(p => {
        return [p.number.toString(), p.bankCode + " " + p.name]
    });

    return (
        <MyModal
            id="savePresetModal"
            headerStyle={{justifyContent: 'center'}}
            headerElements={
                <Heading>
                    {headerTitle}
                </Heading>
            }
            bodyElements={
                <HStack space="sm">
                    <SavePresetForm
                        labels={PRESET_LABELS}
                        inputValue={store.gp200.currentPreset?.name ?? ""}
                        selectValue={store.gp200.currentPresetNumber?.toString() ?? "0"}
                        onCancel={onClose}
                        onSave={onSave}
                    />
                </HStack>
            }
        />
    );
}

export default observer(SaveModal);