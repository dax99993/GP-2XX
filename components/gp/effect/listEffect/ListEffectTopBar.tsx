import TopBar from "@/components/topBar/TopBar";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { ChevronLeftIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";


function ListEffectTopBar() {
    return (
        <TopBar>
            <TopBar.leftItems>
                {
                    <Button variant="solid" action="secondary" size="sm" className="rounded-5">
                        <ButtonIcon as={ChevronLeftIcon} size="sm"/>
                    </Button>
                }
            </TopBar.leftItems>
            <TopBar.centerItems style={{justifyContent: 'center'}}>
                <Center className="bg-secondary-0">
                    <Text size="2xl">CAB</Text>
                </Center>
            </TopBar.centerItems>
        </TopBar>
    );
}


export default ListEffectTopBar;