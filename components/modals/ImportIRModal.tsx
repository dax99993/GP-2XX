import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { useStore } from "@/hooks/useStore";
import { FileInputIcon } from "lucide-react-native";
import { useState } from "react";
import { Button, ButtonGroup, ButtonIcon, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { CloseIcon, Icon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";
import { Text } from "../ui/text";

export const IMPORT_IR_MODAL_ID = "importIRModal";

export const ImportIRModal = observer(() => {
    const store = useStore();
    const [selectedPosition, setSelectedPosition] = useState<number>(0);
    const [name, setName] = useState<String>("");

    // MODAL RELATED Variables and Functions
    const onClose = () => {
        store.modals.closeModal();
    }

    const onSave = () => {
        console.log("Importing IR to positions", selectedPosition);

        // Load preset to GP200 memory
        // const presetInfo = store.presetImporter.presets[index];
        // console.log("Loading IR", store.wavImporter.fileNames[0], "to location", selectedPosition);

        // Send midi message to update preset info
        // store.gpMidiEncoder.LoadPresetToMemory(presetInfo, saveLocation);

        // Reset selected presets
        // setSelected([]);
        
        // CloseModal
        onClose();
    }

    // MODAL BODY
    // const DATA: PresetListItem[] = store.gp200.presets.map((p, i) => {
    //     return {name: p.name, number: p.number, bankCode: mapBankCode(i) }
    // })

    // const onChange = useCallback((v: boolean, n: number) => {
    //     if (v == false) {
    //         setSelected((prev) => prev.filter(p => p !== n));
    //     } else {
    //         if (!selected.includes(n)) {
    //             setSelected((prev) => [...prev, n]);
    //         }
    //     }
    // }, [selected]);

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
                        Import IR
                    </Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <HStack>
                        <Text>{selectedPosition}</Text>
                        <Text>{name}</Text>
                    </HStack>
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
                            // isDisabled={selected.length != MaxSelection}
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
