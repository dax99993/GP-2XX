import ListEffect from '@/components/gp/effect/listEffect/ListEffect';
import ListEffectTopBar from '@/components/gp/effect/listEffect/ListEffectTopBar';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { Platform, StatusBar, StyleSheet } from 'react-native';


function SelectEffect() {
  const router = useRouter();

  const goToEdit = () => {
    router.push("/ui/edit/effecttab")
  };

  return (
    <>
        <VStack style={styles.mainContainer} className='bg-secondary-0'>
          <ListEffectTopBar/>
          <ListEffect data={[]}/>
        </VStack>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    //gap: 8,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
});

export default SelectEffect;