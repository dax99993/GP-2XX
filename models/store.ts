import { makeObservable, observable } from "mobx";
import { GP200Model } from "./gp200";
import { GP200Actions } from "./gp200Actions";
import { GP200DeviceActions } from "./gp200DeviceActions";
import { MidiDevice } from "./midiDevice";



class Store {
    gp200: GP200Model;
    gpActions: GP200Actions;
    midi: MidiDevice;
    gpDeviceActions: GP200DeviceActions;

    constructor() {
        this.gp200 = new GP200Model();
        this.midi = new MidiDevice();
        this.gpActions = new GP200Actions(this.gp200, this.midi);
        this.gpDeviceActions = new GP200DeviceActions(this.gp200, this.midi);

        makeObservable(this,{
            gp200: observable,
            gpActions: observable,
        });
    }

}

export const store = new Store();