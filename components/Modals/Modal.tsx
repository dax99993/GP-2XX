import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";


export interface ModalProps {
    id: string;
    headerStyle?: StyleProp<ViewStyle>,
    headerElements?: ReactNode,
    bodyElements?: ReactNode,
    footerElements?: ReactNode,
}

function MyModal({id, headerStyle, headerElements, bodyElements, footerElements} : ModalProps) {
    const isOpen = store.modals.modals[id];

    //if(!isOpen) return null;

    return (
        <Modal
            size="lg"
            isOpen={isOpen}
            closeOnOverlayClick={true}
            // style={{maxHeight: '75%', justifyContent: 'center', alignItems: 'center'}}
        >
            <ModalBackdrop/>
            <ModalContent
            // style={{maxHeight: height* 1.0}}
            style={{maxHeight: '75%'}}
            >
                {
                    headerElements && 
                    <ModalHeader style={[headerStyle]}>
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