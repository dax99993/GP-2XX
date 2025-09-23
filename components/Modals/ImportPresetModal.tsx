import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { useStore } from "@/hooks/useStore";
import { FlashList } from "@shopify/flash-list";
import { CheckIcon } from "lucide-react-native";
import { Button, ButtonGroup, ButtonText } from "../ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { VStack } from "../ui/vstack";
import MyModal from "./Modal";

export const IMPORT_PRESET_MODAL_ID = "importPresetsModal";

// const PresetsList = observer(() => {
//     const CURRENT_PRESETS_DATA = store.gp200.presets.map(p => {
//         return {name: p.name, number: p.number, bankCode: p.bankCode}
//     })
//     console.log("Current presets:", CURRENT_PRESETS_DATA.length, CURRENT_PRESETS_DATA);

//     const IMPORT_PRESET_DATA = store.presetImporter.presets.map(p => {
//         return {name: p.name, number: p.number}
//     })
//     console.log("IMPORTED PRESETS:", IMPORT_PRESET_DATA.length);

//     // const isDisabled = (positionNumber: number) => {
//     //     const s = store.presetImporter.AllPresetsSelected && !store.presetImporter.SelectedPresetsHas(positionNumber);
//     //     console.log("isDisabled", positionNumber, s);
//     //     return s;
//     //     // return store.presetImporter.AllPresetsSelected;
//     // }

//     // const isChecked = (positionNumber: number) => {
//     // }

//     return (
//         <VStack style={{ flex: 1, justifyContent: 'center' }}>
//             <FlashList
//                 initialScrollIndex={store.gp200.currentPresetNumber ?? 0}
//                 data={CURRENT_PRESETS_DATA}
//                 // drawDistance={200}
//                 estimatedItemSize={24.5}
//                 renderItem={(item) =>
//                     <Checkbox
//                         size="lg"
//                         isDisabled={
//                             // store.presetImporter.AllPresetsSelected && store.presetImporter.SelectedPresetsHas(item.item.number)
//                             !store.presetImporter.SelectedPresetsHas(item.item.number)
//                         }
//                         defaultIsChecked={
//                             store.presetImporter.SelectedPresetsHas(item.item.number)
//                         }
//                         value={item.item.number.toString()}
//                         onChange={(v: boolean) => {
//                             if (v == false) {
//                                 store.presetImporter.RemoveFromSelectPresets(item.item.number);
//                             } else {
//                                 store.presetImporter.AddToSelectPresets(item.item.number);
//                             }
//                             console.log(item.item.name, "State change to", v, store.presetImporter.selectedPresets);
//                         }}
//                     >
//                         <CheckboxIndicator>
//                             <CheckboxIcon as={CheckIcon} />
//                         </CheckboxIndicator>
//                         <CheckboxLabel>{item.item.bankCode + ' ' + item.item.name}</CheckboxLabel>
//                     </Checkbox>
//                 }
//             />
//         </VStack>
//     );
// });

function ImportPresetsModal() {
    const store = useStore();

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
            const presetInfo = store.presetImporter.presets[i];
            console.log("Loading preset", presetInfo.name, "to location", saveLocation);

            // Send midi message to update preset info
            store.gpMidiEncoder.LoadPresetToMemory(presetInfo, saveLocation);
        }

        // Reset selected presets
        
        // CloseModal
        onClose();
    }

    // MODAL BODY
    const CURRENT_PRESETS_DATA = store.gp200.presets.map(p => {
        return {name: p.name, number: p.number, bankCode: p.bankCode}
    })

    // const isDisabled = (positionNumber: number) => {
    //     return store.presetImporter.AllPresetsSelected && !store.presetImporter.SelectedPresetsHas(positionNumber);
    // }

    // const isChecked = (positionNumber: number) => {
    //     return store.presetImporter.SelectedPresetsHas(positionNumber);
    // }

    // MODAL FOOTER variables and functions
    const isImportDisable = !store.presetImporter.AllPresetsSelected;

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
                <VStack style={{ flex: 0, justifyContent: 'center', minHeight: 300 }}>
                    <FlashList
                        initialScrollIndex={store.gp200.currentPresetNumber ?? 0}
                        data={CURRENT_PRESETS_DATA}
                        // data={store.gp200.presets}
                        // drawDistance={200}
                        estimatedItemSize={24.5}
                        renderItem={(item) =>
                            <Checkbox
                                size="lg"
                                isDisabled={
                                    store.presetImporter.AllPresetsSelected && !store.presetImporter.SelectedPresetsHas(item.item.number)
                                }
                                defaultIsChecked={
                                    store.presetImporter.SelectedPresetsHas(item.item.number)
                                }
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
                        onPress={onSave}
                    >
                        <ButtonText>Import presets</ButtonText>
                    </Button>
                </ButtonGroup>
            }
        />
    );
}

export default observer(ImportPresetsModal);