import { DISCONNECT_MODAL_ID } from "@/components/modals/DisconnectModal";
import { SYNC_MODAL_ID } from "@/components/modals/SyncModal";
import { eventHandler, SyncEvents } from "@/utils/eventHandler";
import { PresetExporter } from "@/utils/preset/presetExporter";
import { PresetImporter } from "@/utils/preset/presetImporter";
import { WavImporter } from "@/utils/wav/wavImporter";
import { action, makeObservable, observable, runInAction } from "mobx";
import { GP200MidiDecoder } from "./actions/gp200MidiDecoder";
import { GP200MidiEncoder } from "./actions/gp200MidiEncoder";
import { GP200Model } from "./gp200";
import { MidiDevice } from "./midiDevice";
import ModalStore from "./modalStore";


export class Store {
    gp200: GP200Model;
    midi: MidiDevice;
    gpMidiEncoder: GP200MidiEncoder;
    gpMidiDecoder: GP200MidiDecoder;
    presetImporter: PresetImporter;
    presetExporter: PresetExporter;
    wavImporter: WavImporter;

    modals: ModalStore;

    showPatchSettings: boolean;
    syncTimer: ReturnType<typeof setTimeout> | null = null; // Type for setTimeout return value

    constructor() {
        this.gp200 = new GP200Model();
        this.modals = new ModalStore();
        this.presetImporter = new PresetImporter();
        this.presetExporter = new PresetExporter();
        this.wavImporter = new WavImporter();

        this.syncTimer = null;

        const midiDisconnectCb = () => {
            // this.modals.openModal("disconnectModal");
            this.modals.openModal(DISCONNECT_MODAL_ID);
        }
        const midiConnectCb = (isJr: boolean) => {
            // Get model type
            this.gp200.isJR = isJr;

            //this.modals.closeModal("disconnectModal");
            this.modals.openModal(SYNC_MODAL_ID);
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
        // Set a timeout for syncing (90 seconds timeout)
        this.syncTimer = setTimeout(() => {
            console.log("Sync Timeout Executed!")
            if (!this.gp200.isSynced) {
                // Stop syncing
                // remove syncing events
                eventHandler.removeEventListener(SyncEvents.StoredPresetSynced);
                eventHandler.removeEventListener(SyncEvents.CurrentPresetSynced);
                eventHandler.removeEventListener(SyncEvents.UserIRNameSynced);
                eventHandler.removeEventListener(SyncEvents.SyncComplete);

                // Set Flag to show sync error modal
                runInAction(() => {
                    this.gp200.syncing = false;
                    this.gp200.syncingStoredPresets = false;
                    this.gp200.syncingCurrentPreset = false;
                    this.gp200.syncingIRNames = false;
                    this.gp200.syncingErrorOccur = true;
                })
            }
        }, 90 * 1000);

        // ADD ALL THE SYNC EVENT LISTENERS
        eventHandler.addEventListener(SyncEvents.StoredPresetSynced, (args: number[]) => this.StoredPresetsSynced.bind(this)(args[0]));
        eventHandler.addEventListener(SyncEvents.CurrentPresetSynced, this.CurrentPresetSynced.bind(this));
        eventHandler.addEventListener(SyncEvents.UserIRNameSynced, this.StoredIRNameSynced.bind(this));
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
            this.gp200.syncingErrorOccur = true;
        })
    }

    SyncComplete() {
        eventHandler.removeEventListener(SyncEvents.SyncComplete);
        console.log("Sync Complete event received");

        // Clear SyncTimeout
        if (this.syncTimer != null) {
            console.log("Sync Timeout Timer Cleared!");
            clearTimeout(this.syncTimer);
        }

        // Unset syncing flag
        runInAction(() => {
            this.gp200.syncing = false;
            this.gp200.isSynced = true;
        })

        // Close Syncing modal
        this.modals.closeModal();
    }

    StartSync() {
        // EMIT THE FIRST EVENT IN THE LIST

        // Start syncing presets (preset 0)
        console.log("START SYNC PROCESS");
        runInAction(() => {
            this.gp200.syncingStoredPresets = true;
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
                this.gp200.syncingStoredPresets = false;
            })

            // START NEXT SYNC STEP
            console.log("Start getting current preset");
            runInAction(() => {
                this.gp200.syncingCurrentPreset = true;
            })
            this.gpMidiEncoder.AskCurrentPresetInfo();
        }
    }

    CurrentPresetSynced() {
        eventHandler.removeEventListener(SyncEvents.CurrentPresetSynced);
        console.log("Synced Current Preset event received!");
        runInAction(() => {
            this.gp200.syncingCurrentPreset = false;
        })

        // This is the last event so sync is complete
        // this.SyncComplete();

        // Remove event listener
        console.log("Sync Current presets finished");
        eventHandler.removeEventListener(SyncEvents.CurrentPresetSynced);
        runInAction(() => {
            this.gp200.syncingCurrentPreset = false;
        })

        // START NEXT SYNC STEP
        console.log("Ask IR NAME 0");
        runInAction(() => {
            this.gp200.syncingIRNames = true;
        })
        this.gpMidiEncoder.AskIRName(0);
    }

    StoredIRNameSynced(IRNumber: number) {
        console.log("Sync IR Name event received!", IRNumber);
        if (this.gp200.syncingIRNames) {
            console.log("Ask Preset Info", IRNumber);
            this.gpMidiEncoder.AskIRName(IRNumber);
        } else {
            // Remove event listener
            console.log("Sync IR name finished");
            eventHandler.removeEventListener(SyncEvents.UserIRNameSynced);
            runInAction(() => {
                this.gp200.syncingIRNames = false;
            })

            // START NEXT SYNC STEP
            // This is the last event so sync is complete
            this.SyncComplete();
        }
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

// export const store = new Store();