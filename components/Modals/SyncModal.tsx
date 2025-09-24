import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";

import { useStore } from "@/hooks/useStore";
import { VStack } from "../ui/vstack";
import MyModal from "./Modal";


function SyncModal() {
    const store = useStore();

    const headerTitle = "Syncing GP-200";
    let syncingBodyText = "";
    if (store.gp200.syncingStoredPresets || store.gp200.syncingCurrentPreset) {
        syncingBodyText = "Loading Presets";
    }
    const progressValue = store.gp200.presets.length / 256 * 100;

    return (
        <MyModal
            id="syncModal"
            headerElements={
                <Heading>
                    {headerTitle}
                </Heading>
            }
            bodyElements={
                <HStack space="sm">
                    {store.gp200.syncingErrorOccur && 
                    <VStack>
                        <Text size="md">An error occur while syncing.</Text>
                        <Text size="md">Please reconnect device.</Text>
                    </VStack>
                    }
                    {!store.gp200.syncingErrorOccur &&
                    <>
                        <Spinner />
                        <Text size="md">{syncingBodyText}</Text>
                    </>
                    }
                </HStack>
            }
            footerElements={
                <Progress value={progressValue} size="md" orientation="horizontal">
                    <ProgressFilledTrack />
                </Progress>
            }
        />
    );
}

export default observer(SyncModal);