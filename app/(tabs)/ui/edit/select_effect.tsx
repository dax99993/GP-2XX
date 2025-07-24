import ListEffect from '@/components/gp/effect/listEffect/ListEffect';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';


function SelectEffect() {
  const router = useRouter();

  return (
    <>
        <VStack style={{flex:1}}>
          <Button onPress={() => router.push("/ui/edit/effecttab")}>
            <ButtonText>{"<"}</ButtonText>
          </Button>
          <ListEffect data={[]}/>
        </VStack>
    </>
  );
}

export default SelectEffect;