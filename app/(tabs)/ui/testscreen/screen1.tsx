
import { Platform, StatusBar, StyleSheet } from 'react-native';

import ListEffect from '@/components/gp/effect/listEffect/ListEffect';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { AddIcon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';




export default function TestScreen() {
  const router = useRouter();

  return (
    <>
        <VStack style={{flex:1}}>
          <Button onPress={() => router.push("/ui/edit/effecttab")}>
            <ButtonText>{"<"}</ButtonText>
            <ButtonIcon as={AddIcon} className="ml-2" />
          </Button>
          <ListEffect data={[]}/>
        </VStack>
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: 'pink',
  },
  presetContainer: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'column',
  },
  controlContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'yellow',
  },
  bannerContainer: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  viewButtons: {
    flex: 2,
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //maxWidth: 500,
  }
});