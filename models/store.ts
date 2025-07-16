import { makeObservable, observable } from "mobx";
import { GP200Model } from "./gp200";
import { MidiGPDeviceModel } from "./gpMidiDevice";



class Store {
    gp200: GP200Model;
    gpmidi: MidiGPDeviceModel;
    //midi: MidiDevice;

    constructor() {
        this.gp200 = new GP200Model();
        this.gpmidi = new MidiGPDeviceModel();
        //this.midi = new MidiDevice();

        this.gp200.addMidi(this.gpmidi);
        this.gpmidi.addGP(this.gp200);

        makeObservable(this,{
            gp200: observable,
            gpmidi: observable,
        });
    }

}

export const store = new Store();