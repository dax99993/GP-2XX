import { store } from "@/models/store";
import { useEffect } from "react";



function useSyncGP() {
    const isSyncing = store.gp200.syncing;
    const syncedPresets = store.gp200.syncedPresets;
    const inputPort = store.midi.inputPort;


    useEffect(()=>{
        // Start Syncing

    }, [inputPort])

    useEffect(()=> {
        if (!isSyncing) {
            store.gpMidiEncoder.AskPresetInfo(syncedPresets);
        }
    },[isSyncing])


    useEffect(() => {

    }, [])

    return;
}


//export default observer(useSyncGP);