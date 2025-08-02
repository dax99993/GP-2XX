import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";


export interface ModalProps {
    id: string;
    headerElements?: ReactNode,
    bodyElements?: ReactNode,
    footerElements?: ReactNode,
}

function MyModal({id, headerElements, bodyElements, footerElements} : ModalProps) {
    const isOpen = store.modals.modals[id];

    //if(!isOpen) return null;

    return (
        <Modal
            size="lg"
            isOpen={isOpen}
        >
            <ModalBackdrop/>
            <ModalContent>
                {
                    headerElements && 
                    <ModalHeader>
                        {headerElements}
                    </ModalHeader>
                }
                {
                    bodyElements &&
                    <ModalBody>
                        {bodyElements}
                    </ModalBody>
                }
                {
                    footerElements &&
                    <ModalFooter>
                        {footerElements}
                    </ModalFooter>
                }
            </ModalContent>
        </Modal>
    );
}


export default observer(MyModal);