import { eventHandler, SyncEvents } from "@/utils/eventHandler";
import { PresetExporter } from "@/utils/presetExporter";
import { PresetImporter } from "@/utils/presetImporter";
import { action, makeObservable, observable } from "mobx";
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
        eventHandler.addEventListener(SyncEvents.SyncComplete, this.SyncComplete.bind(this));

        // Reset state to start Syncing again
        this.gp200.SetToStartSyncing();

        // Maybe each of these one in a try catch block and if failed set store.gp200.syncingErrorOccur = true; to show modal
        // Sync USER IR names
        // Sync DST NAM names
        // Sync AMP NAM names
        // Sync UserStyle category names
        // ** Sync switches mode and current configuration **
        this.StartSyncPreset();
        // Sync presets
        // Sync current temporal preset

    }

    SyncComplete() {
        //this.gp200.syncing = false;
        // Go to preset 0 as we dont have info of temporal preset
        store.gpMidiEncoder.ChangePreset(0);
        this.modals.closeModal("syncModal");
    }

    StartSyncPreset() {
        // eventHandler.addEventListener(SyncEvents.PresetSynced, (presetNumber: number) => this.SyncPresets(presetNumber));
        eventHandler.addEventListener(SyncEvents.PresetSynced, (args: number[]) => this.SyncPresets.bind(this)(args[0]));
        eventHandler.emitEvent(SyncEvents.PresetSynced, 0);

        // eventHandler.addEventListener(SyncEvents.PresetSynced, ({presetNumber}: {presetNumber: number}) => this.SyncPresets.bind(this)(presetNumber));
        // eventHandler.emitEvent(SyncEvents.PresetSynced, {presetNumber: 0});
    }

    SyncPresets(presetNumber: number) {
        console.log("Sync Preset event received!", presetNumber);
        if (!this.gp200.isSynced) {
        // if (presetNumber < 1) {
            //console.log("Sync preset", this.gp200.syncedPresets);
            console.log("Sync preset", presetNumber);
            // this.gpMidiEncoder.AskStoredPresetInfo(this.gp200.syncedPresets);
            this.gpMidiEncoder.AskStoredPresetInfo(presetNumber);
        } else {
            // Remove event listener
            console.log("Sync presets finished");
            eventHandler.removeEventListener(SyncEvents.PresetSynced);

            eventHandler.emitEvent(SyncEvents.SyncComplete);
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

export const store = new Store();