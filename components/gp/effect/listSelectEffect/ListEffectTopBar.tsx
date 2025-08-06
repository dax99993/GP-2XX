import TopBar from "@/components/topBar/TopBar";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ChevronLeftIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { store } from "@/models/store";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";


function ListEffectTopBar() {
    const router = useRouter();

    const goToEdit = () => {
        router.push("/ui/edit/effecttab")
    };

    const effectType = store.gp200.currentEffect?.typeName;

    return (
        <TopBar>
            <TopBar.leftItems>
                <Button variant="solid" action="secondary" size="sm" className="rounded-5" onPress={goToEdit}>
                    <ButtonIcon as={ChevronLeftIcon} size="sm" />
                </Button>
            </TopBar.leftItems>
            <TopBar.centerItems>
                    <Text size="2xl"></Text>
                    <Text size="2xl">{effectType}</Text>
                    <Text size="2xl"></Text>
            </TopBar.centerItems>
        </TopBar>
    );
}


export default observer(ListEffectTopBar);