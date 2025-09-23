import TopBar from "@/components/topBar/TopBar";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useStore } from "@/hooks/useStore";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { observer } from "mobx-react-lite";


function ListEffectTopBar() {
    const store = useStore();
    const router = useRouter();

    const goToEdit = () => {
        // go back to edit screen
        router.back();
    };

    const effectType = store.gp200.currentEffect ? store.gp200.currentEffect.typeName : "Module";

    return (
        <TopBar>
            <TopBar.leftItems>
                <Button variant="solid" action="secondary" size="lg" className="rounded-xl px-3" onPress={goToEdit}>
                    <ButtonIcon as={ArrowLeftIcon} />
                </Button>
            </TopBar.leftItems>
            <TopBar.centerItems>
                    <Text bold={true} size="2xl">{effectType}</Text>
            </TopBar.centerItems>
        </TopBar>
    );
}


export default observer(ListEffectTopBar);