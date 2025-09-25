import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";

import { useStore } from "@/hooks/useStore";
import { Picker } from "@react-native-picker/picker";
import { AlertCircleIcon } from "lucide-react-native";
import { useState } from "react";
import { Button, ButtonText } from "../ui/button";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "../ui/form-control";
import { CloseIcon, Icon } from "../ui/icon";
import { Input, InputField } from "../ui/input";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";
import { VStack } from "../ui/vstack";

export const SAVE_PRESET_MODAL_ID = "savePresetModal";

export const SavePresetModal = observer(() => {
    const store = useStore();

    const onClose = () => {
        store.modals.closeModal();
    }

    const onSave = (presetNumber: number, presetName: string) => {
        console.log("Save preset", presetNumber, "with name:", presetName);
        // Save preset
        store.gpMidiEncoder.SaveCurrentPreset(presetNumber, presetName);

        // Go to new saved preset
        store.gpMidiEncoder.ChangePreset(presetNumber);

        // CloseModal
        onClose();
    }

    const PRESET_LABELS: [string, string][] = store.gp200.presets.map(p => {
        return [p.number.toString(), p.bankCode + " " + p.name]
    });

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
                        Save Preset
                    </Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <SavePresetForm
                        labels={PRESET_LABELS}
                        inputValue={store.gp200.currentPreset?.name ?? ""}
                        selectValue={store.gp200.currentPresetNumber?.toString() ?? "0"}
                        onCancel={onClose}
                        onSave={onSave}
                    />
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
});


interface SavePresetFormProps {
    labels: [string, string][];
    inputValue: string;
    selectValue: string;
    onCancel: () => void;
    onSave: (presetNumber: number, presetName: string) => void;
}

const SavePresetForm = (props: SavePresetFormProps) => {
    const [inputValue, setInputValue] = useState(props.inputValue);
    const [isInputValid, setIsInputValid] = useState(true);
    const [selectValue, setSelectValue] = useState(props.selectValue);

    const pickerItems = props.labels.map(label => (
        <Picker.Item key={label[0]} value={label[0]} label={label[1]}/>
    ));

    const validateInput = (s: string) => {
        return s.length <= 16 && /^[\x00-\x7E]*$/.test(s);
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
                        <FormControlLabelText>Preset Name</FormControlLabelText>
                    </FormControlLabel>
                    <Input
                        style={{ flex: 7 }}
                        className="my-1" size="md"
                        isInvalid={!isInputValid}
                    >
                        <InputField
                            placeholder="Preset name"
                            value={inputValue}
                            onChangeText={(s) =>
                                onChangeInput(s)
                            }
                        />
                    </Input>
                    <FormControlHelper>
                        <FormControlHelperText>
                            {`${inputValue.length} of max 16 characters.`}
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
                        <FormControlLabelText>Bank</FormControlLabelText>
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
                        <ButtonText>
                            Save
                        </ButtonText>
                    </Button>
                </FormControl>
            </HStack>
        </>
    );
}