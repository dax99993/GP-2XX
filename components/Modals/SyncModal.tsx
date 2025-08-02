import { observer } from "mobx-react-lite";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";

import { store } from "@/models/store";
import MyModal from "./Modal";


function SyncModal() {
    const headerTitle = "Syncing GP-200";
    const bodyText = "Loading Preset " + store.gp200.syncedPresets;
    const progressValue = 40;

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
                    <Spinner />
                    <Text size="md">{bodyText}</Text>
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