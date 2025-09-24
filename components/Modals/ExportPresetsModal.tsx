import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { useStore } from "@/hooks/useStore";
import { FlashList } from "@shopify/flash-list";
import { CheckIcon, FileOutputIcon, Share2Icon } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { Button, ButtonGroup, ButtonIcon, ButtonText } from "../ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { VStack } from "../ui/vstack";
import MyModal from "./Modal";

const MODAL_ID = "exportPresetsModal";

interface PresetListItem {
    name: string,
    bankCode: string,
    number: number,
}

interface PresetsListProps {
    data: PresetListItem[],
    scrollToIndex: number,
    // currentIndex: number,
    isChecked: (n: number) => boolean,
    onChange: (v: boolean, n:number) => void;
}

const PresetsList = (props: PresetsListProps) => {
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
    }, []);

    return (
        <VStack style={{minHeight: 200, maxHeight: 250}}>
            <FlashList
                ref={listRef}
                data={props.data}
                // initialScrollIndex={props.currentIndex}
                // extraData={props.currentIndex}
                // drawDistance={400}
                estimatedItemSize={25}
                keyExtractor={(item) => item.number.toString()}
                renderItem={(item) =>
                    <Checkbox
                        size="lg"
                        defaultIsChecked={props.isChecked(item.item.number)}
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

function ExportPresetsModal() {
    const store = useStore();

    const headerTitle = "Export Presets";

    const onClose = () => {
        store.modals.closeModal(MODAL_ID);
    }

    const onShare = async () => {
        console.log("Export presets", store.presetExporter.selectedPresets);

        // Get preset info 
        const presets = store.gp200.presets.filter((_, i) => store.presetExporter.SelectedPresetsHas(i));

        presets.forEach(async p => {
            console.log("Sharing", p.name);
        })

        // Share presets
        await store.presetExporter.SharePresetFiles(presets);

        // Reset selected Presets
        store.presetExporter.ResetSelectedPresets();

        // CloseModal
        onClose();
    }

    const onExport = () => {
        console.log("Export presets", store.presetExporter.selectedPresets);

        // Get preset info 
        const presets = store.gp200.presets.filter((_, i) => store.presetExporter.SelectedPresetsHas(i));

        // Export presets to folder
        store.presetExporter.ExportPresetFiles(presets);

        // Reset selected Presets
        store.presetExporter.ResetSelectedPresets();

        // CloseModal
        onClose();
    }

    const DATA: PresetListItem[] = store.gp200.presets.map(p => {
        return {name: p.name, number: p.number, bankCode: p.bankCode}
    })

    return (
        <MyModal
            id={MODAL_ID}
            headerStyle={{justifyContent: 'center'}}
            headerElements={
                <Heading>
                    {headerTitle}
                </Heading>
            }
            bodyElements={
                <PresetsList
                    data={DATA}
                    // currentIndex={store.gp200.currentPresetNumber ?? 0}
                    scrollToIndex={store.gp200.currentPresetNumber ?? 0}
                    isChecked={(n: number) => {
                        return store.presetExporter.SelectedPresetsHas(n);
                    }}
                    onChange={(v: boolean, n: number) => {
                            if (v == false) {
                                store.presetExporter.RemoveFromSelectedPresets(n);
                            } else {
                                store.presetExporter.AddToSelectedPresets(n);
                            }
                            // console.log(name, "State change to", v, props.presetExporter.selectedPresets);
                            console.log("Selected presets", store.presetExporter.selectedPresets);
                    }}
                />
            }
            footerElements={
                <ButtonGroup flexDirection="row">
                    <Button
                        variant='solid'
                        size="sm"
                        action="secondary"
                        isDisabled={false}
                        onPress={onClose}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                        variant='solid'
                        size="sm"
                        isDisabled={store.presetExporter.selectedPresets.length !== 1}
                        onPress={onShare}
                    >
                        <ButtonIcon as={Share2Icon}/>
                        <ButtonText>Share</ButtonText>
                    </Button>
                    {
                    Platform.OS == "android" &&
                    <Button
                        size="sm"
                        variant='solid'
                        isDisabled={store.presetExporter.selectedPresets.length == 0}
                        onPress={onExport}
                    >
                        <ButtonIcon as={FileOutputIcon}/>
                        <ButtonText>Export</ButtonText>
                    </Button>
                    }
                </ButtonGroup>
            }
        />
    );
}

export default observer(ExportPresetsModal);