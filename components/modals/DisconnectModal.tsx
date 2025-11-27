import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";

import { UnplugIcon } from "lucide-react-native";
import React from "react";
import { Icon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";
import { VStack } from "../ui/vstack";

export const DISCONNECT_MODAL_ID = "disconnectModal";

export const DisconnectModal = () => {
    return (
        <Modal
            size="lg"
            isOpen={true}
            closeOnOverlayClick={true}
        >
            <ModalBackdrop/>
            <ModalContent
            >
                <ModalHeader>
                    <HStack space="md">
                        <Icon as={UnplugIcon} size="md" />
                        <Heading>
                            GP-200 disconnected!
                        </Heading>
                    </HStack>
                </ModalHeader>
                <ModalBody>
                    <VStack space="lg">
                        <Text size="md">GP-200 connection has been lost.</Text>
                        <Text size="md">Please connect again.</Text>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}