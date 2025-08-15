import { Button, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Picker } from "@react-native-picker/picker";
import { AlertCircleIcon } from "lucide-react-native";
import { useState } from "react";

// const DATA: number[] = Array.from({ length: 256 }, (_, index) => index);
// const LABELS: [string, string][] = DATA.map(d => [d.toString(), d.toString()]);

interface Props {
    labels: [string, string][];
    inputValue: string;
    selectValue: string;
    onCancel: () => void;
    onSave: (presetNumber: number, presetName: string) => void;
}

function SavePresetForm(props: Props) {
    //const [inputValue, setInputValue] = useState("");
    const [inputValue, setInputValue] = useState(props.inputValue);
    const [isInputValid, setIsInputValid] = useState(true);
    const [selectValue, setSelectValue] = useState(props.selectValue);

    const pickerItems = props.labels.map(label => (
        <Picker.Item key={label[0]} value={label[0]} label={label[1]}/>
    ));

    const validateInput = (s: string) => {
        return s.length <= 16 && /^[\x00-\x7F]*$/.test(s);
    }

    const onChangeInput = (s: string) => {
        setIsInputValid(validateInput(s));
        setInputValue(s);
    }

    return (
        <VStack space="xl" style={{flex:1}}>
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

            <HStack style={{justifyContent:'flex-end'}}>
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
                        action={isInputValid ? "primary": "negative"}
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

        </VStack>
    );
}

export default SavePresetForm;