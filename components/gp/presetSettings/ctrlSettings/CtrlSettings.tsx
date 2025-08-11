import BoundBox from "@/components/BoundBox";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import CtrlEffectUnit from "./CtrlEffectUnit";



function CtrlSettings() {

    return (
        <BoundBox>
            <VStack space="lg">
                <Center>
                    <Heading>Ctrl Settings</Heading>
                </Center>
                <ButtonGroup space="md" flexDirection="row" style={{alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button>
                        <ButtonText>CTRL 1</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>CTRL 2</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>CTRL 3</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>CTRL 4</ButtonText>
                    </Button>
                </ButtonGroup>
                <ButtonGroup space="md" flexDirection="row" style={{alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button>
                        <ButtonText>CTRL 5</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>CTRL 6</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>CTRL 7</ButtonText>
                    </Button>
                    <Button>
                        <ButtonText>CTRL 8</ButtonText>
                    </Button>
                </ButtonGroup>
                <Divider/>
                <CtrlEffectUnit/>
            </VStack>
        </BoundBox>
    )
}


export default CtrlSettings;