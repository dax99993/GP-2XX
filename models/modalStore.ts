import { action, makeObservable, observable } from "mobx";


export default class ModalStore {
    modals: Record<string, boolean> = {};

    constructor() {
        makeObservable(this, {
            modals: observable,

            openModal: action,
            closeModal: action,
        })
    }

    openModal(id: string) {
        // Close all the other modals
        for (const [key, value] of Object.entries(this.modals)) {
            if (key !== id) {
                this.closeModal(key);
            }
        }

        this.modals[id] = true;
        console.log("Modal", id, "opened!");

    }

    closeModal(id: string) {
        this.modals[id] = false;
        console.log("Modal", id, "closed!");
    }
}
