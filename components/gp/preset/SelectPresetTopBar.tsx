import TopBar from "@/components/topBar/TopBar";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useStore } from "@/hooks/useStore";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { observer } from "mobx-react-lite";


function SelectPresetTopBar() {
    const store = useStore();
    //if (store.gp200.currentPreset == undefined) {return null};

    const router = useRouter();

    const goToEdit = () => {
        // go back to edit screen
        router.back();
    };

    const bankCode = store.gp200.currentPreset ? store.gp200.currentPresetBankCode : "YY-XX";
    const presetName = store.gp200.currentPreset? store.gp200.currentPreset.name : "Preset name";

    return (
        <TopBar>
            <TopBar.leftItems>
                <Button size="lg" action="secondary" className='rounded-xl px-3' onPress={goToEdit}>
                    <ButtonIcon as={ArrowLeftIcon} />
                </Button>
            </TopBar.leftItems>
            <TopBar.centerItems>
                    <Text size="2xl" bold={true}>{bankCode + " " + presetName}</Text>
            </TopBar.centerItems>
        </TopBar>
    );
}


export default observer(SelectPresetTopBar);