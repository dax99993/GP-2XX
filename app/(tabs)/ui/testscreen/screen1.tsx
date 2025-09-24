
import { Platform, StatusBar, StyleSheet, View } from 'react-native';


import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import useOrientation from '@/hooks/useOrientation';
import { Orientation } from 'expo-screen-orientation';
import React, { useEffect, useRef } from 'react';



import TopBar from '@/components/topBar/TopBar';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { FlashList } from '@shopify/flash-list';


const List = (props: {data: number[], scrollTo: number, onPress: (n: number)=>void}) => {
  useEffect(()=>{
    // const timer = setTimeout( ()=> {
    //   console.log("Timer scroll")
    //   listRef.current?.scrollToIndex({ index: props.scrollTo, viewPosition: 0 })
    // }, 1000);

    // return () => clearTimeout(timer);

      listRef.current?.scrollToIndex({ index: props.scrollTo, viewPosition: 0 })
  },[])

  const listRef = useRef<FlashList<any>>(null);
 return (
        <FlashList
        ref={listRef}
        data={props.data}
        // initialScrollIndex={40}
        estimatedItemSize={21}
        renderItem={(item) => (
          <HStack style={{width: 70}}>
            <Button>
              <ButtonText onPress={() => props.onPress(item.item)}>{item.item}</ButtonText>
            </Button>
          </HStack>
        )}        
        />
 );
}

export default function TestScreen() {
  const {orientation, isLandscape} = useOrientation();
  console.log(Orientation[orientation]);

  const DATA = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <VStack space='xs' style={styles.maincontainer}>
      <TopBar>
        <TopBar.leftItems>
          <Text>Left</Text>
        </TopBar.leftItems>
        <TopBar.centerItems>
          <Text>TopBar</Text>
        </TopBar.centerItems>
        <TopBar.rightItems>
          <Text>Right</Text>
        </TopBar.rightItems>
      </TopBar>
      <Button>
        <ButtonText>Scroll</ButtonText>
      </Button>
      {/* <View style={isLandscape ? styles.landscapeContainer : styles.portraitContainer} > */}
      <View style={{flex:0 , backgroundColor: 'red', minWidth: 100, maxHeight: 250, justifyContent: 'center'}} >
        <List data={DATA} scrollTo={25} onPress={(n: number)=>{console.log("Pressed", n)}}/>
      </View>
    </VStack>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    //flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: 'blue',
  },
  landscapeContainer: {
    flex:1,
    flexDirection: 'row', // Example: change layout direction in landscape
    // Add more landscape-specific styles here
    backgroundColor: 'white',
    gap: 5,
  },
  portraitContainer: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: 'red',
    gap: 5,
  }
});