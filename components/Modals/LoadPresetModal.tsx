import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";

import { store } from "@/models/store";
import LoadPresetList from "../gp/preset/LoadPresetList";
import { Button, ButtonGroup, ButtonText } from "../ui/button";
import MyModal from "./Modal";

const MODAL_ID = "loadPresetsModal";


function LoadPresetsModal() {

    const headerTitle = "Load Presets";

    const onClose = () => {
        store.modals.closeModal(MODAL_ID);
    }

    const onSave = (presetNumber: number, presetName: string) => {
        console.log("Save preset", presetNumber, "with name:", presetName);
        // Save preset
        store.gpActions.SaveCurrentPreset(presetNumber, presetName);

        // Go to new saved preset
        store.gpActions.ChangePreset(presetNumber);

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
            // id={ID}
            headerStyle={{justifyContent: 'center'}}
            headerElements={
                <HStack style={{flex: 1, justifyContent: 'space-between'}}>
                <Heading>
                    {headerTitle}
                </Heading>
                <Button variant='outline' onPress={onClose}>
                    <ButtonText>X</ButtonText>
                </Button>
                </HStack>
            }
            bodyElements={
                <LoadPresetList/>
            }
            footerElements={
                <ButtonGroup flexDirection="row">
                    <Button variant='solid' isDisabled={false} onPress={onClose}>
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button variant='solid' isDisabled={false} onPress={() => console.log("Load to presets to memory!")}>
                        <ButtonText>Load presets</ButtonText>
                    </Button>
                </ButtonGroup>
            }
        />
    );
}

export default observer(LoadPresetsModal);