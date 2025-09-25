import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { useStore } from "@/hooks/useStore";
import { FlashList } from "@shopify/flash-list";
import { CheckIcon, FileOutputIcon, Share2Icon } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { Button, ButtonGroup, ButtonIcon, ButtonText } from "../ui/button";
// import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { CloseIcon, Icon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export const EXPORT_PRESETS_MODAL_ID = "exportPresetsModal";


export const ExportPresetsModal = observer(() => {
    const store = useStore();

    const [selected, setSelected] = useState<number[]>(
        store.gp200.currentPresetNumber != undefined ? [store.gp200.currentPresetNumber] : []
    );

    useEffect(() => {
        console.log("Selected Presets", selected);
    }, [selected]);


    const onClose = () => {
        store.modals.closeModal();
    }

    const onShare = async () => {
        // Get preset info 
        const presets = selected.map((n) => store.gp200.presets[n]);

        presets.forEach(async p => {
            console.log("Sharing presets", p.name, p.number);
        })

        // Share presets
        await store.presetExporter.SharePresetFiles(presets);

        // Reset selected Presets
        setSelected([]);

        // CloseModal
        onClose();
    }

    const onExport = () => {
        // console.log("Export presets", store.presetExporter.selectedPresets);
        console.log("Export presets", selected);

        // Get preset info 
        // const presets = store.gp200.presets.filter((_, i) => selected.includes(i));
        const presets = selected.map((n) => store.gp200.presets[n]);

        // Export presets to folder
        store.presetExporter.ExportPresetFiles(presets);

        // Reset selected Presets
        setSelected([]);

        // CloseModal
        onClose();
    }

    const isChecked = useCallback( (n: number) => {
        return selected.includes(n);
    }, [selected])

    const onChange = useCallback((v: boolean, n: number) => {
        if (v == false) {
            setSelected((prev) => prev.filter(p => p !== n));
        } else {
            if (!selected.includes(n)) {
                setSelected((prev) => [...prev, n]);
            }
        }
    }, [selected]);

    const DATA: PresetListItem[] = useMemo( () => (
        store.gp200.presets.map(p => {
        return {name: p.name, number: p.number, bankCode: p.bankCode} })
    ), []);

    return (
        <Modal
            size="lg"
            isOpen={true}
            onClose={onClose}
            closeOnOverlayClick={true}
        >
            <ModalBackdrop />
            <ModalContent
            >
                <ModalHeader>
                    <Heading size="xl">
                        Export Presets
                    </Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <PresetsList
                        data={DATA}
                        extraData={selected.length}
                        scrollToIndex={store.gp200.currentPresetNumber ?? 0}
                        isChecked={isChecked}
                        onChange={onChange}
                    />
                </ModalBody>
                <ModalFooter>
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
                            isDisabled={selected.length !== 1}
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
                            isDisabled={selected.length == 0}
                            onPress={onExport}
                        >
                            <ButtonIcon as={FileOutputIcon}/>
                            <ButtonText>Export</ButtonText>
                        </Button>
                        }
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
});


interface PresetListItem {
    name: string,
    bankCode: string,
    number: number,
}

interface PresetsListProps {
    data: PresetListItem[],
    extraData: number,
    scrollToIndex: number,
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
                extraData={props.extraData}
                // initialScrollIndex={props.currentIndex}
                // drawDistance={400}
                estimatedItemSize={25}
                keyExtractor={(item) => item.number.toString()}
                renderItem={(item) => {
                    const isChecked = props.isChecked(item.item.number);
                    return <TouchableOpacity 
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: isChecked ? 'blue': 'transparent'
                        }}
                        onPress={() => {
                            props.onChange(!isChecked, item.item.number);
                        }}
                    >
                        <Text
                            bold={isChecked}
                            size="lg"
                        >
                            {item.item.bankCode + ' ' + item.item.name}
                        </Text>
                        { isChecked &&
                            <Icon as={CheckIcon}/>
                        }
                    </TouchableOpacity>
                }}
            />
        </VStack>
    );
};