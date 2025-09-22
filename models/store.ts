import { eventHandler, SyncEvents } from "@/utils/eventHandler";
import { PresetExporter } from "@/utils/presetExporter";
import { PresetImporter } from "@/utils/presetImporter";
import { action, makeObservable, observable, runInAction } from "mobx";
import { GP200MidiDecoder } from "./actions/gp200MidiDecoder";
import { GP200MidiEncoder } from "./actions/gp200MidiEncoder";
import { GP200Model } from "./gp200";
import { MidiDevice } from "./midiDevice";
import ModalStore from "./modalStore";



class Store {
    gp200: GP200Model;
    midi: MidiDevice;
    gpMidiEncoder: GP200MidiEncoder;
    gpMidiDecoder: GP200MidiDecoder;
    presetImporter: PresetImporter;
    presetExporter: PresetExporter;

    modals: ModalStore;

    showPatchSettings: boolean;

    constructor() {
        this.gp200 = new GP200Model();
        this.modals = new ModalStore();
        this.presetImporter = new PresetImporter();
        this.presetExporter = new PresetExporter();

        const midiDisconnectCb = () => {
            this.modals.openModal("disconnectModal");
        }
        const midiConnectCb = () => {
            //this.modals.closeModal("disconnectModal");
            this.modals.openModal("syncModal");
            // Start sync
            this.SyncGP();
        }

        this.midi = new MidiDevice(midiConnectCb, midiDisconnectCb);

        this.gpMidiEncoder = new GP200MidiEncoder(this.gp200, this.midi);
        this.gpMidiDecoder = new GP200MidiDecoder(this.gp200, this.midi);

        // Add listener socan be add to input in case device already connected when this is loaded
        this.gpMidiDecoder.setupReceivedSysEx();

        // Start to get midi access
        this.midi.getMidiAccess();

        // Helper properties
        this.showPatchSettings = false;

        makeObservable(this,{
            gp200: observable,
            gpMidiEncoder: observable,
            presetImporter: observable,

            showPatchSettings: observable,

            SyncGP: action,
            changeShowPatchSettings: action
        });
    }

    changeShowPatchSettings(state: boolean) {
        this.showPatchSettings = state;
    }

    SyncGP() {
        // ADD ALL THE SYNC EVENT LISTENERS
        eventHandler.addEventListener(SyncEvents.StoredPresetSynced, (args: number[]) => this.StoredPresetsSynced.bind(this)(args[0]));
        eventHandler.addEventListener(SyncEvents.CurrentPresetSynced, this.CurrentPresetSynced.bind(this));
        eventHandler.addEventListener(SyncEvents.SyncComplete, this.SyncComplete.bind(this));

        // Reset state to start Syncing again
        this.gp200.SetToStartSyncing();

        // ADD TIMEOUT to syncing process if timeout => Set store.gp200.syncingErrorOccur = true; to show modal
        // Start Syncing events
        this.StartSync();
        // EVENTS ORDER
        // Sync USER IR names
        // Sync DST NAM names
        // Sync AMP NAM names
        // Sync UserStyle category names
        // ** Sync switches mode and current configuration **
        // Sync presets
        // Sync current temporal preset
    }

    SyncError() {
        runInAction(() => {
            store.gp200.syncingErrorOccur = true;
        })
    }

    SyncComplete() {
        eventHandler.removeEventListener(SyncEvents.SyncComplete);
        console.log("Sync Complete event received");

        // Unset syncing flag
        runInAction(() => {
            store.gp200.syncing = false;
            store.gp200.isSynced = true;
        })

        // Close Syncing modal
        this.modals.closeModal("syncModal");
    }

    StartSync() {
        // EMIT THE FIRST EVENT IN THE LIST

        // Start syncing presets (preset 0)
        console.log("START SYNC PROCESS");
        runInAction(() => {
            store.gp200.syncingStoredPresets = true;
        })
        this.gpMidiEncoder.AskStoredPresetInfo(0);
    }

    StoredPresetsSynced(presetNumber: number) {
        console.log("Sync Stored Preset event received!", presetNumber);
        if (this.gp200.syncingStoredPresets) {
            console.log("Ask Preset Info", presetNumber);
            this.gpMidiEncoder.AskStoredPresetInfo(presetNumber);
        } else {
            // Remove event listener
            console.log("Sync stored presets finished");
            eventHandler.removeEventListener(SyncEvents.StoredPresetSynced);
            runInAction(() => {
                store.gp200.syncingStoredPresets = false;
            })

            // START NEXT SYNC STEP
            console.log("Start getting current preset");
            runInAction(() => {
                store.gp200.syncingCurrentPreset = true;
            })
            this.gpMidiEncoder.AskCurrentPresetInfo();
        }
    }

    CurrentPresetSynced() {
        eventHandler.removeEventListener(SyncEvents.CurrentPresetSynced);
        console.log("Synced Current Preset event received!");
        runInAction(() => {
            store.gp200.syncingCurrentPreset = false;
        })

        // This is the last event so sync is complete
        this.SyncComplete();
    }

    // SyncGP() {
    //     // Reset state to start Syncing again
    //     this.gp200.SetToStartSyncing();
    //     const maxTriesPerPreset = 4;
    //     let tries = 0;
    //     let syncedPresets = 0;
    //     // Start syncing process after 1 seconds
    //     const timeoutID = setTimeout(() => {
    //         // clearInterval when device is disconnected! otherwise infine loop occurs.
    //         const intervalId = setInterval(() => {
    //             if (!store.gp200.isSynced && !this.gp200.syncing && tries < maxTriesPerPreset) {
    //                 console.log(`Executing ask preset ${this.gp200.syncedPresets} try:  ${tries}`);
    //                 // Your code to execute in each iteration
    //                 if (syncedPresets != this.gp200.syncedPresets) {
    //                     console.log("Preset", syncedPresets, "done");
    //                     syncedPresets = this.gp200.syncedPresets;
    //                     tries = 0;
    //                 }
    //                 tries++;
    //                 this.gpMidiEncoder.AskPresetInfo(this.gp200.syncedPresets);
    //             } else {
    //                 // Could not sync the device stop this and reconnect to try again
    //                 if (!this.gp200.isSynced) {
    //                     console.log("SYNCING PROBLEM OCCUR");
    //                     runInAction(() => {
    //                         store.gp200.syncingErrorOccur = true;
    //                     })
    //                 } else {
    //                     console.log("SYNCING SUCCESSFUL");
    //                     this.modals.closeModal("syncModal");

    //                     // Execute action to changePreset to current preset in device
    //                     runInAction(() => {
    //                         store.gpMidiEncoder.ChangePreset(0);
    //                     })

    //                 }
    //                 clearInterval(intervalId); // Stop the interval when the condition is met
    //             }
    //         }, 500); // Execute every quater of second
    //     }, 3500);

    //     //clearTimeout(timeoutID);
    // }

}

export const store = new Store();