import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { useStore } from "@/hooks/useStore";
import { Picker } from "@react-native-picker/picker";
import { AlertCircleIcon, FileInputIcon } from "lucide-react-native";
import { useState } from "react";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "../ui/form-control";
import { HStack } from "../ui/hstack";
import { CloseIcon, Icon } from "../ui/icon";
import { Input, InputField } from "../ui/input";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "../ui/modal";
import { VStack } from "../ui/vstack";

export const IMPORT_IR_MODAL_ID = "importIRModal";

export const ImportIRModal = observer(() => {
    const store = useStore();

    // MODAL RELATED Variables and Functions
    const onClose = () => {
        store.modals.closeModal();
    }

    const onSave = (selectedPosition: number, name: string) => {
        console.log("Importing IR to position", selectedPosition, "with name", name);

        // Load preset to GP200 memory
        // const presetInfo = store.presetImporter.presets[index];
        // console.log("Loading IR", store.wavImporter.fileNames[0], "to location", selectedPosition);

        // Send midi message to update preset info
        store.gpMidiEncoder.LoadIRToMemory(store.wavImporter.wavs[0], selectedPosition, name);

        // CloseModal
        onClose();
    }

    // MODAL BODY
    const LABELS: [string, string][] = store.gp200.irNames.map((v, i) => [i.toString(), `User IR ${i+1} - ${v}`]);

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
                    <ImportIRForm
                        labels={LABELS}
                        inputValue={store.wavImporter.fileNames[0].slice(0, 15)}
                        selectValue={"0"}
                        onCancel={onClose}
                        onSave={onSave}
                    />
                </ModalBody>
                {/* <ModalFooter>
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
                </ModalFooter> */}
            </ModalContent>
        </Modal>
    );
});

interface ImportIRFormProps {
    labels: [string, string][];
    inputValue: string;
    selectValue: string;
    onCancel: () => void;
    onSave: (IRNumber: number, IRName: string) => void;
}

const ImportIRForm = (props: ImportIRFormProps) => {
    const MAX_LENGTH = 15;
    const [inputValue, setInputValue] = useState(props.inputValue);
    const [isInputValid, setIsInputValid] = useState(true);
    const [selectValue, setSelectValue] = useState(props.selectValue);

    const pickerItems = props.labels.map(label => (
        <Picker.Item key={label[0]} value={label[0]} label={label[1]}/>
    ));

    // Valid ascii string with at max 16 characters
    const validateInput = (s: string) => {
        return s.length <= MAX_LENGTH && /^[\x00-\x7E]*$/.test(s);
    }

    const onChangeInput = (s: string) => {
        setIsInputValid(validateInput(s));
        setInputValue(s);
    }

    return (
        <>
            <VStack space="md" style={{ flex: 1 }}>
                <FormControl
                    isInvalid={!isInputValid}
                    size="md"
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                >
                    <FormControlLabel>
                        <FormControlLabelText>IR name</FormControlLabelText>
                    </FormControlLabel>
                    <Input
                        style={{ flex: 7 }}
                        className="my-1" size="md"
                        isInvalid={!isInputValid}
                    >
                        <InputField
                            placeholder="IR name"
                            value={inputValue}
                            onChangeText={(s) =>
                                onChangeInput(s)
                            }
                        />
                    </Input>
                    <FormControlHelper>
                        <FormControlHelperText>
                            {`${inputValue.length} of max ${MAX_LENGTH} characters.`}
                        </FormControlHelperText>
                    </FormControlHelper>
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>
                            Only ASCII characters are allowed.
                        </FormControlErrorText>
                    </FormControlError>
                </FormControl>

                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>IR slot</FormControlLabelText>
                    </FormControlLabel>

                    <Picker style={{ flex: 3 }}
                        mode="dialog"
                        selectedValue={selectValue}
                        onValueChange={(v, i) => { setSelectValue(v) }}
                    >
                        {pickerItems}
                    </Picker>
                </FormControl>
            </VStack>
            <HStack style={{ justifyContent: 'flex-end' }}>
                <FormControl>
                    <Button
                        variant="outline"
                        action="secondary"
                        onPress={props.onCancel}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                </FormControl>
                <FormControl >
                    <Button
                        isDisabled={!isInputValid}
                        action={isInputValid ? "primary" : "negative"}
                        className="ml-4"
                        onPress={() => {
                            console.log(selectValue, inputValue);
                            props.onSave(parseInt(selectValue), inputValue)
                        }}
                    >
                        <ButtonIcon as={FileInputIcon}/>
                        <ButtonText>Import</ButtonText>
                    </Button>
                </FormControl>
            </HStack>
        </>
    );
}