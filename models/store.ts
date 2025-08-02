import { action, makeObservable, observable } from "mobx";
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

    constructor() {
        this.gp200 = new GP200Model();
        this.modals = new ModalStore();

        const midiDisconnectCb = () => {
            this.modals.openModal("disconnectModal");
        }
        const midiConnectCb = () => {
            //this.modals.closeModal("disconnectModal");
            this.modals.openModal("syncModal");
            //this.SyncGP();
        }

        this.midi = new MidiDevice(midiConnectCb, midiDisconnectCb);

        this.gpActions = new GP200Actions(this.gp200, this.midi);
        this.gpDeviceActions = new GP200DeviceActions(this.gp200, this.midi);

        // Add listener socan be add to input in case device already connected when this is loaded
        this.gpDeviceActions.setupReceivedSysEx();

        // Start to get midi access
        this.midi.getMidiAccess();


        makeObservable(this,{
            gp200: observable,
            gpActions: observable,

            SyncGP: action,
        });
    }

    // SyncGP() {
    //     // Reset state to start Syncing again
    //     while (this.gp200.syncedPresets < 4) {
    //         const intervalId = setInterval(() => {
    //             if (!this.gp200.syncing) {
    //                 console.log(`Executing ask preset ${this.gp200.syncedPresets}`);
    //                 // Your code to execute in each iteration
    //                 this.gpActions.AskPresetInfo(this.gp200.syncedPresets);
    //             } else {
    //                 clearInterval(intervalId); // Stop the interval when the condition is met
    //                 console.log("Preset", this.gp200.syncedPresets, "done");
    //             }
    //         }, 1000); // Execute every 1000 milliseconds (1 second)
    //     }
    // }

    SyncGP() {
        // Reset state to start Syncing again
        const intervalId = setInterval(() => {
            if (this.gp200.syncedPresets < 2 && !this.gp200.syncing) {
                console.log(`Executing ask preset ${this.gp200.syncedPresets}`);
                // Your code to execute in each iteration
                //this.gpActions.AskPresetInfo(this.gp200.syncedPresets);
            } else {
                clearInterval(intervalId); // Stop the interval when the condition is met
                console.log("Preset", this.gp200.syncedPresets, "done");
            }
        }, 2000); // Execute every 1000 milliseconds (1 second)
    }
}

export const store = new Store();