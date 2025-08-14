import TopBar from "@/components/topBar/TopBar";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ChevronLeftIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { store } from "@/models/store";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";


function SelectPresetTopBar() {
    if (store.gp200.currentPreset == undefined) {return null};

    const router = useRouter();

    const goToEdit = () => {
        router.push("/ui/edit/effecttab")
    };

    const bankCode = store.gp200.currentPreset?.bankCode;
    const presetName = store.gp200.currentPreset?.name;

    return (
        <TopBar>
            <TopBar.leftItems>
                <Button variant="solid" action="secondary" size="sm" className="rounded-5" onPress={goToEdit}>
                    <ButtonIcon as={ChevronLeftIcon} size="sm" />
                </Button>
            </TopBar.leftItems>
            <TopBar.centerItems>
                    <Text size="2xl"></Text>
                    <Text size="2xl" bold={true}>{bankCode + " " + presetName}</Text>
                    <Text size="2xl"></Text>
            </TopBar.centerItems>
        </TopBar>
    );
}


export default observer(SelectPresetTopBar);