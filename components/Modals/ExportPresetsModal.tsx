import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";

import { store } from "@/models/store";
import { Button, ButtonGroup, ButtonText } from "../ui/button";
import MyModal from "./Modal";

const MODAL_ID = "exportPresetsModal";


function ExportPresetsModal() {

    const headerTitle = "Export Presets";

    const onClose = () => {
        store.modals.closeModal(MODAL_ID);
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

    // Get current presets name
    const PRESET_LABELS: [string, string][] = store.gp200.presets.map(p => {
        return [p.number.toString(), p.bankCode + " " + p.name]
    });

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
                <></>
            }
            footerElements={
                <ButtonGroup flexDirection="row">
                    <Button variant='solid' isDisabled={false} onPress={onClose}>
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button variant='solid' isDisabled={false} onPress={() => console.log("Export presets!")}>
                        <ButtonText>Export presets</ButtonText>
                    </Button>
                </ButtonGroup>
            }
        />
    );
}

export default observer(ExportPresetsModal);