import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { useStore } from "@/hooks/useStore";
import { FlashList } from "@shopify/flash-list";
import { CheckIcon, FileInputIcon } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Button, ButtonGroup, ButtonIcon, ButtonText } from "../ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { VStack } from "../ui/vstack";
import MyModal from "./Modal";

export const IMPORT_PRESET_MODAL_ID = "importPresetsModal";

interface PresetListItem {
    name: string,
    bankCode: string,
    number: number,
}

interface PresetsListProps {
    data: PresetListItem[],
    // presetImporter: PresetImporter,
    scrollToIndex: number,
    isChecked: (index: number) => boolean,
    isDisabled: (index: number) => boolean,
    onChange: (v: boolean, index: number) => void,
    // initialSelected: number[],
    // maxSelected: number,
}

const PresetsList = (props: PresetsListProps) => {

    // const [selected, setSelected] = useState(props.initialSelected);
    const listRef = useRef<FlashList<any>>(null);

    useEffect(() => {
        console.log("Change initial Scroll", props.scrollToIndex);

        const timer = setTimeout(() => {
            listRef.current?.scrollToIndex({
                index: props.scrollToIndex,
                animated: true,
                viewOffset: 0,
                viewPosition: 0.29,
            })
            console.log("Timer executed!");
        }, 0);


        return () => {
            console.log("Timer clear");
            clearTimeout(timer);
        };
    },[])

    // const isDisabled = (positionNumber: number) => {
        // return props.presetImporter.AllPresetsSelected &&
        //     !props.presetImporter.SelectedPresetsHas(positionNumber);
    // }

    // const isChecked = (positionNumber: number) => {
    //     return props.presetImporter.SelectedPresetsHas(positionNumber)
    // }

    return (
        <VStack style={{minHeight: 200, maxHeight: 250}}>
            <FlashList
                ref={listRef}
                // extraData={props.currentIndex}
                // initialScrollIndex={props.scrollTo}
                data={props.data}
                // drawDistance={200}
                estimatedItemSize={24.5}
                keyExtractor={(item) => item.number.toString()}
                renderItem={(item) =>
                    <Checkbox
                        size="lg"
                        isDisabled={ props.isDisabled(item.item.number) }
                        defaultIsChecked={ props.isChecked(item.item.number) }
                        value={item.item.number.toString()}
                        onChange={(v: boolean) => {
                            props.onChange(v, item.item.number);
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
};

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
    const DATA: PresetListItem[] = store.gp200.presets.map(p => {
        return {name: p.name, number: p.number, bankCode: p.bankCode}
    })

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
                <PresetsList
                    data={DATA}
                    scrollToIndex={store.gp200.currentPresetNumber ?? 0}
                    isChecked={(index: number) =>
                        store.presetImporter.SelectedPresetsHas(index)
                    }
                    isDisabled={ (index : number) => 
                        store.presetImporter.AllPresetsSelected &&
                        !store.presetImporter.SelectedPresetsHas(index)
                    }
                    onChange={(v: boolean, index: number) => {
                            if (v == false) {
                                store.presetImporter.RemoveFromSelectPresets(index);
                            } else {
                                store.presetImporter.AddToSelectPresets(index);
                            }
                    }}
                />
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
                        <ButtonIcon as={FileInputIcon}/>
                        <ButtonText>Import</ButtonText>
                    </Button>
                </ButtonGroup>
            }
        />
    );
}

export default observer(ImportPresetsModal);