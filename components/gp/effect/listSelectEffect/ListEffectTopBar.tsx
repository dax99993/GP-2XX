import TopBar from "@/components/topBar/TopBar";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ChevronLeftIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";


function ListEffectTopBar() {
    const router = useRouter();

    const goToEdit = () => {
        router.push("/ui/edit/effecttab")
    };

    return (
        <TopBar>
            <TopBar.leftItems>
                <Button variant="solid" action="secondary" size="sm" className="rounded-5" onPress={goToEdit}>
                    <ButtonIcon as={ChevronLeftIcon} size="sm" />
                </Button>
            </TopBar.leftItems>
            <TopBar.centerItems>
                <VStack style={{justifyContent: 'center'}}>
                    <Text size="2xl">CAB</Text>
                </VStack>
            </TopBar.centerItems>
        </TopBar>
    );
}


export default ListEffectTopBar;