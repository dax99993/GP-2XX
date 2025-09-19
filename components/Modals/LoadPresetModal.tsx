import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { store } from "@/models/store";
import { FlashList } from "@shopify/flash-list";
import { CheckIcon } from "lucide-react-native";
import { Button, ButtonGroup, ButtonText } from "../ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { VStack } from "../ui/vstack";
import MyModal from "./Modal";

export const IMPORT_PRESET_MODAL_ID = "importPresetsModal";

const PresetsList = observer(() => {
    const CURRENT_PRESETS_DATA = store.gp200.presets.map(p => {
        return {name: p.name, number: p.number, bankCode: p.bankCode}
    })
    console.log("Current presets:", CURRENT_PRESETS_DATA.length, CURRENT_PRESETS_DATA);

    const LOAD_PRESET_DATA = store.presetImporter.presets.map(p => {
        return {name: p.name, number: p.number}
    })
    console.log("LOADED PRESETS:", LOAD_PRESET_DATA.length, LOAD_PRESET_DATA);

    const isDisabled = (positionNumber: number) => {
        return store.presetImporter.selectedPresets.length == LOAD_PRESET_DATA.length &&
        !store.presetImporter.SelectedPresetsHas(positionNumber);
    }

    const isChecked = (positionNumber: number) => {
        return store.presetImporter.SelectedPresetsHas(positionNumber);
    }

    return (
        <VStack style={{ flex: 0, justifyContent: 'center', minHeight: 100, maxHeight: 24.5 * 16 }}>
            <FlashList
                initialScrollIndex={store.gp200.currentPresetNumber ?? 0}
                data={CURRENT_PRESETS_DATA}
                //drawDistance={40}
                estimatedItemSize={24.5}
                renderItem={(item) =>
                    <Checkbox
                        size="lg"
                        isDisabled={isDisabled(item.item.number)}
                        defaultIsChecked={isChecked(item.item.number)}
                        value={item.item.number.toString()}
                        onChange={(v: boolean) => {
                            if (v == false) {
                                store.presetImporter.RemoveFromSelectPresets(item.item.number);
                            } else {
                                store.presetImporter.AddToSelectPresets(item.item.number);
                            }
                            console.log(item.item.name, "State change to", v, store.presetImporter.selectedPresets);
                        }}
                    >
                        <CheckboxIndicator>
                            <CheckboxIcon as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>{item.item.bankCode + ' ' + item.item.name}</CheckboxLabel>
                    </Checkbox>
                }
            />
        </VStack>
    );
});

function LoadPresetsModal() {

    // MODAL RELATED Variables and Functions
    const headerTitle = "Import Presets";

    const onClose = () => {
        store.modals.closeModal(IMPORT_PRESET_MODAL_ID);
    }

    const onSave = () => {
        console.log("Importing presets to positions", store.presetImporter.selectedPresets);

        for (let i = 0; i < store.presetImporter.selectedPresets.length; i=i+1) {
            // Load preset to GP200 memory
            const saveLocation = store.presetImporter.selectedPresets[i];
            console.log("Loading preset", store.presetImporter.presets[i].name, "to location", saveLocation);
            //store.gpMidiEncoder.SaveCurrentPreset(presetNumber, presetName);
        }

        // CloseModal
        onClose();
    }


    // MODAL FOOTER variables and functions
    // const isImportDisable = store.presetImporter.currentlySelectedPresets.length != LOAD_PRESET_DATA.length;
    const isImportDisable = store.presetImporter.selectedPresets.length != store.presetImporter.presets.length;

    return (
        <MyModal
            id={IMPORT_PRESET_MODAL_ID}
            headerStyle={{justifyContent: 'center'}}
            headerElements={
                <Heading>
                    {headerTitle}
                </Heading>
            }
            bodyElements={
                <PresetsList/>
            }
            footerElements={
                <ButtonGroup flexDirection="row">
                    <Button
                        variant='outline'
                        action="secondary"
                        isDisabled={false}
                        onPress={onClose}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                        variant='solid'
                        isDisabled={isImportDisable}
                        onPress={() => {
                            console.log("Load to presets to memory!")
                            onSave();
                        }}
                    >
                        <ButtonText>Import presets</ButtonText>
                    </Button>
                </ButtonGroup>
            }
        />
    );
}

export default observer(LoadPresetsModal);