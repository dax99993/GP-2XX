import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { useStore } from "@/hooks/useStore";
import { FlashList } from "@shopify/flash-list";
import { CheckIcon, FileInputIcon } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, ButtonIcon, ButtonText } from "../ui/button";
// import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { TouchableOpacity } from "react-native";
import { CloseIcon, Icon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export const IMPORT_PRESET_MODAL_ID = "importPresetsModal";

export const ImportPresetsModal = observer(() => {
    const store = useStore();
    const MaxSelection = store.presetImporter.presets.length;
    const [selected, setSelected] = useState<number[]>(
        Array.from({ length: MaxSelection }, (_, i) => (store.gp200.currentPresetNumber ?? 0) + i)
        // [],
    );

    // MODAL RELATED Variables and Functions
    const onClose = () => {
        store.modals.closeModal();
    }

    const onSave = () => {
        console.log("Importing presets to positions", selected);

        selected.forEach((saveLocation, index) => {
            // Load preset to GP200 memory
            const presetInfo = store.presetImporter.presets[index];
            console.log("Loading preset", presetInfo.name, "to location", saveLocation);

            // Send midi message to update preset info
            store.gpMidiEncoder.LoadPresetToMemory(presetInfo, saveLocation);
        });

        // Reset selected presets
        setSelected([]);
        
        // CloseModal
        onClose();
    }

    // MODAL BODY
    const DATA: PresetListItem[] = store.gp200.presets.map(p => {
        return {name: p.name, number: p.number, bankCode: p.bankCode}
    })

    const isChecked = useCallback( (n: number) => {
        return selected.includes(n);
    }, [selected])

    const isDisabled = useCallback( (n: number) => {
        return selected.length == MaxSelection &&
            !selected.includes(n)
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

    return (
        <Modal
            size="lg"
            isOpen={true}
            onClose={onClose}
            closeOnOverlayClick={true}
        >
            <ModalBackdrop/>
            <ModalContent
            >
                <ModalHeader>
                    <Heading>
                        Import Presets
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
                        isDisabled={isDisabled}
                        onChange={onChange}
                    />
                </ModalBody>
                <ModalFooter>
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
                            isDisabled={selected.length != MaxSelection}
                            onPress={onSave}
                        >
                            <ButtonIcon as={FileInputIcon}/>
                            <ButtonText>Import</ButtonText>
                        </Button>
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
    isChecked: (index: number) => boolean,
    isDisabled: (index: number) => boolean,
    onChange: (v: boolean, index: number) => void,
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
        }, 100);


        return () => {
            console.log("Timer clear");
            clearTimeout(timer);
        };
    },[])


    return (
        <VStack style={{minHeight: 200, maxHeight: 250}}>
            <FlashList
                ref={listRef}
                extraData={props.extraData}
                // initialScrollIndex={props.scrollTo}
                data={props.data}
                // drawDistance={200}
                estimatedItemSize={24.5}
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
                        disabled={props.isDisabled(item.item.number)}
                        onPress={() => {
                            props.onChange(!isChecked, item.item.number);
                        }}
                    >
                        <Text bold={isChecked} size="lg" >
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