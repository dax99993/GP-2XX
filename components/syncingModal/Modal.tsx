import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "../ui/modal";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";

export type SyncingModalProps = {
    isOpen: boolean;
    headerTitle: string;
    bodyText: string;
    progressValue: number;
}

export default function SyncingModal(props: SyncingModalProps) {
    //const [isOp, setModalVisible] = useState(true);

    return (
          <Modal
            size="lg"
            isOpen={props.isOpen}
          >
            <ModalContent>
                <ModalHeader>
                    <Heading>
                        {props.headerTitle}
                    </Heading>
                </ModalHeader>
                <ModalBody>
                    <HStack space="sm">
                        <Spinner />
                        <Text size="md">{props.bodyText}</Text>
                    </HStack>
                </ModalBody>
                <ModalFooter>
                        <Progress value={props.progressValue} size="md" orientation="horizontal">
                            <ProgressFilledTrack />
                        </Progress>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}