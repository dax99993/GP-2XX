import { action, makeObservable, observable, runInAction } from "mobx";
import { GP200Actions } from "./actions/gp200Actions";
import { GP200DeviceActions } from "./actions/gp200DeviceActions";
import { GP200Model } from "./gp200";
import { MidiDevice } from "./midiDevice";
import ModalStore from "./modalStore";



class Store {
    gp200: GP200Model;
    gpActions: GP200Actions;
    midi: MidiDevice;
    gpDeviceActions: GP200DeviceActions;

    modals: ModalStore;

    showPatchSettings: boolean;

    constructor() {
        this.gp200 = new GP200Model();
        this.modals = new ModalStore();

        const midiDisconnectCb = () => {
            this.modals.openModal("disconnectModal");
        }
        const midiConnectCb = () => {
            //this.modals.closeModal("disconnectModal");
            this.modals.openModal("syncModal");
            this.SyncGP();
        }

        this.midi = new MidiDevice(midiConnectCb, midiDisconnectCb);

        this.gpActions = new GP200Actions(this.gp200, this.midi);
        this.gpDeviceActions = new GP200DeviceActions(this.gp200, this.midi);

        // Add listener socan be add to input in case device already connected when this is loaded
        this.gpDeviceActions.setupReceivedSysEx();

        // Start to get midi access
        this.midi.getMidiAccess();

        // Helper properties
        this.showPatchSettings = false;

        makeObservable(this,{
            gp200: observable,
            gpActions: observable,

            showPatchSettings: observable,

            SyncGP: action,
            changeShowPatchSettings: action
        });
    }

    changeShowPatchSettings(state: boolean) {
        this.showPatchSettings = state;
    }


    SyncGP() {
        // Reset state to start Syncing again
        this.gp200.SetToStartSyncing();
        const maxTriesPerPreset = 5;
        let tries = 0;
        let syncedPresets = 0;
        // Start syncing process after 1 seconds
        const timeoutID = setTimeout(() => {
            // clearInterval when device is disconnected! otherwise infine loop occurs.
            const intervalId = setInterval(() => {
                if (!store.gp200.isSynced && !this.gp200.syncing && tries < maxTriesPerPreset) {
                    console.log(`Executing ask preset ${this.gp200.syncedPresets}`);
                    // Your code to execute in each iteration
                    if (syncedPresets != this.gp200.syncedPresets) {
                        console.log("Preset", syncedPresets, "done");
                        syncedPresets = this.gp200.syncedPresets;
                        tries = 0;
                    }
                    tries++;
                    this.gpActions.AskPresetInfo(this.gp200.syncedPresets);
                } else {
                    // Could not sync the device stop this and reconnect to try again
                    if (!this.gp200.isSynced) {
                        console.log("SYNCING PROBLEM OCCUR");
                        runInAction(() => {
                            store.gp200.syncingErrorOccur = true;
                        })
                    } else {
                        console.log("SYNCING SUCCESSFUL");
                        this.modals.closeModal("syncModal");

                        // Execute action to changePreset to current preset in device
                        runInAction(() => {
                            store.gpActions.ChangePreset(0);
                        })

                    }
                    clearInterval(intervalId); // Stop the interval when the condition is met
                }
            }, 250); // Execute every quater of second
        }, 1500);

        //clearTimeout(timeoutID);
    }
}

export const store = new Store();