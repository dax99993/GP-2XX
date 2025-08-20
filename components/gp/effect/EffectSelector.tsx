import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { store } from "@/models/store";
import { useRouter } from "expo-router";
import { ChevronRightIcon } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import { TouchableOpacity } from "react-native";

function EffectSelector() {

    const router = useRouter();

    const goToSelectEffect = () => {
        router.push("/ui/edit/select_effect");
    };

    const name = store.gp200.currentEffect ? store.gp200.currentEffect.name : "";

    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={goToSelectEffect}>
            <HStack style={{ flex: 1, justifyContent: 'space-between' }} className="bg-secondary-300 mx-3 my-2 px-2 py-2 rounded-md">
                <Center style={{ flex: 1 }}>
                    <Text bold={true}>{name}</Text>
                </Center>
                <Center>
                    <Icon as={ChevronRightIcon} className="ml-2" size="xl" />
                </Center>
            </HStack>
        </TouchableOpacity>
    );
}

export default observer(EffectSelector);