import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { store } from "@/models/store";
import { FlashList } from "@shopify/flash-list";
import { CheckIcon } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Button, ButtonGroup, ButtonText } from "../ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { HStack } from "../ui/hstack";
import MyModal from "./Modal";

export const IMPORT_PRESET_MODAL_ID = "importPresetsModal";


function LoadPresetsModal() {

    // MODAL RELATED Variables and Functions
    const headerTitle = "Import Presets";

    const onClose = () => {
        store.modals.closeModal(IMPORT_PRESET_MODAL_ID);
    }

    const onSave = (savingPositions: number[]) => {
        console.log("Importing presets to positions", savingPositions);
        // Save preset
        //store.gpMidiEncoder.SaveCurrentPreset(presetNumber, presetName);

        // Go to new saved preset
        //store.gpMidiEncoder.ChangePreset(presetNumber);

        // CloseModal
        onClose();
    }


    // MODAL CONTENT Variables and Functions

    const CURRENT_PRESETS_DATA = store.gp200.presets.map(p => {
        return {name: p.name, number: p.number, bankCode: p.bankCode}
    })
    console.log("Current presets:", CURRENT_PRESETS_DATA.length, CURRENT_PRESETS_DATA);

    const LOAD_PRESET_DATA = store.presetImporter.presets.map(p => {
        return {name: p.name, number: p.number}
    })
    console.log("LOADED PRESETS:", LOAD_PRESET_DATA.length, LOAD_PRESET_DATA);

    const startSavingPosition = store.gp200.currentPresetNumber ? store.gp200.currentPresetNumber : 0;
    console.log("Starting positions:", startSavingPosition);

    // states
    const [savePositions, setSavePositions] = useState(
        Array.from({ length: LOAD_PRESET_DATA.length }, (_, i) =>  startSavingPosition + i)
        );
    console.log("Save positions:", savePositions);

    const isDisabled = useCallback((positionNumber: number)=> {
        //console.log("Current positions", savePositions);
        return savePositions.length == LOAD_PRESET_DATA.length && !savePositions.includes(positionNumber);
    }, [ savePositions ])

    const isChecked = useCallback((positionNumber: number) => {
        return savePositions.includes(positionNumber);
    }, [savePositions])


    // MODAL FOOTER variables and functions
    const isImportDisable = savePositions.length != LOAD_PRESET_DATA.length;


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
                <HStack style={{ flex: 0, justifyContent: 'center', maxHeight: 24.5 * 16 }}>
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
                                    console.log(item.item.name, "State change to", v);
                                    if (v == false) {
                                        setSavePositions(prevPositions => prevPositions.filter(n => n != item.item.number).sort((a, b) => a - b));
                                    } else {
                                        setSavePositions(prevPositions => [...prevPositions, item.item.number].sort((a, b) => a - b));
                                    }
                                }}
                            >
                                <CheckboxIndicator>
                                    <CheckboxIcon as={CheckIcon} />
                                </CheckboxIndicator>
                                <CheckboxLabel>{item.item.bankCode + ' ' + item.item.name}</CheckboxLabel>
                            </Checkbox>
                        }
                    />
                </HStack>
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
                            onSave(savePositions);
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