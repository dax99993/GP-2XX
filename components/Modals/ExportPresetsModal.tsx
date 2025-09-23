import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { useStore } from "@/hooks/useStore";
import { FlashList } from "@shopify/flash-list";
import { CheckIcon } from "lucide-react-native";
import { Platform } from "react-native";
import { Button, ButtonGroup, ButtonText } from "../ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { VStack } from "../ui/vstack";
import MyModal from "./Modal";

const MODAL_ID = "exportPresetsModal";

const PresetsList = observer(() => {
    const store = useStore();

    const CURRENT_PRESETS_DATA = store.gp200.presets.map(p => {
        return {name: p.name, number: p.number, bankCode: p.bankCode}
    })
    console.log("Current presets:", CURRENT_PRESETS_DATA.length);

    const isChecked = (positionNumber: number) => {
        return store.presetExporter.SelectedPresetsHas(positionNumber);
    }

    return (
        <VStack style={{ flex: 0, justifyContent: 'center', minHeight: 200 }}>
            <FlashList
                initialScrollIndex={store.gp200.currentPresetNumber ?? 0}
                data={CURRENT_PRESETS_DATA}
                //drawDistance={40}
                estimatedItemSize={24.5}
                renderItem={(item) =>
                    <Checkbox
                        size="lg"
                        defaultIsChecked={isChecked(item.item.number)}
                        value={item.item.number.toString()}
                        onChange={(v: boolean) => {
                            if (v == false) {
                                store.presetExporter.RemoveFromSelectedPresets(item.item.number);
                            } else {
                                store.presetExporter.AddToSelectedPresets(item.item.number);
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
                <PresetsList/>
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
                        <ButtonText>Export</ButtonText>
                    </Button>
                    }
                </ButtonGroup>
            }
        />
    );
}

export default observer(ExportPresetsModal);