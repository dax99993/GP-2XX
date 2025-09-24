import { useStore } from "@/hooks/useStore";
import { observer } from "mobx-react-lite";
import { DISCONNECT_MODAL_ID, DisconnectModal } from "./DisconnectModal";
import { EXPORT_PRESETS_MODAL_ID, ExportPresetsModal } from "./ExportPresetsModal";
import { IMPORT_PRESET_MODAL_ID, ImportPresetsModal } from "./ImportPresetModal";
import { SAVE_PRESET_MODAL_ID, SavePresetModal } from "./SaveModal";
import { SYNC_MODAL_ID, SyncModal } from "./SyncModal";


export const ModalManager = observer(() => {
    const store = useStore();

    const renderActiveModal = () => {
        switch (store.modals.activeModal) {
            case DISCONNECT_MODAL_ID:
                return <DisconnectModal/>;
            case SYNC_MODAL_ID:
                return <SyncModal/>
            case SAVE_PRESET_MODAL_ID:
                return <SavePresetModal/>
            case EXPORT_PRESETS_MODAL_ID:
                return <ExportPresetsModal/>;
            case IMPORT_PRESET_MODAL_ID:
                return <ImportPresetsModal/>;
            default:
                return null;
        }
    }

    return (
        <>
        {store.modals.activeModal && renderActiveModal()}
        </>
    );
});
