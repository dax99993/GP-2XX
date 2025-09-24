import { action, makeObservable, observable } from "mobx";


export default class ModalStore {
    activeModal: string | null = null;
    modalProps = {};

    constructor() {
        makeObservable(this, {
            activeModal: observable,
            modalProps: observable,

            openModal: action,
            closeModal: action,
        })
    }

    openModal(modalID: string) {
        this.activeModal = modalID;
        // this.modalProps = modalProps;
        console.log("Modal", modalID, "opened!");
    }

    closeModal() {
        this.activeModal = null;
        // this.modalProps = {};
        console.log("Modal closed!");
    }
}