import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useStore } from "@/hooks/useStore";
import { useRouter } from "expo-router";
import { ChevronRightIcon } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import { TouchableOpacity } from "react-native";

function EffectSelector() {
  const store = useStore();
  const router = useRouter();

  const goToSelectEffect = () => {
    router.push("/ui/edit/select_effect");
  };

  const isIR = (ID: number) => ID >= 168820736 && ID <= 168820755;
  const getIRIndex = (ID: number) => ID - 168820736;

  const ID = store.gp200.currentEffect ? store.gp200.currentEffect.ID : -1;
  let name = store.gp200.currentEffect ? store.gp200.currentEffect.name : "";
  name = ID != -1 && isIR(ID) ? store.gp200.irNames[getIRIndex(ID)] : name;

  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={goToSelectEffect}>
      <HStack
        style={{ flex: 1, justifyContent: "space-between" }}
        className="bg-secondary-300 mx-3 my-2 px-2 py-2 rounded-md"
      >
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
