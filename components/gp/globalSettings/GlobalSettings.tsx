import { Platform, StatusBar, StyleSheet } from 'react-native';

import BoundBox from '@/components/core/BoundBox';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { useScrolling } from '@/contexts/scroll-context';
import { FlashList } from '@shopify/flash-list';
import { useRef, useState } from 'react';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { EqualizerSettings } from './equalizer/EqualizerSettings';



export default function GlobalSettings() {
  const { isScrollingEnabled, enableScrolling, disableScrolling} = useScrolling();
  // const {isLandscape} = useOrientation();
  const [selectedSettings, setSelectedSettings] = useState(0);
  const listRef = useRef<FlashList<any>>(null);

  // useEffect(() => {
  //   listRef.current?.scrollToIndex({index: selectedSettings, animated: true, viewPosition: 0.5 });
  // }, [selectedSettings, isLandscape])

  const buttonTitles = ['EQ', 'General'];

  return (
    <VStack space='md' className='bg-secondary-0' style={{flex: 1}}>
        <GestureHandlerRootView>
            <ScrollView scrollEnabled={isScrollingEnabled}>
                <VStack space='md' className='bg-secondary-0' style={{flex:1}}>
                  <BoundBox style={{ flex: 1 }}>
                    <VStack space='md' style={{flex:1}}>
                      <Center>
                        <Heading>Global Settings</Heading>
                      </Center>
                      <FlashList
                        ref={listRef}
                        horizontal={true}
                        data={buttonTitles}
                        estimatedItemSize={75}
                        renderItem={(info) => (
                          <Button
                            key={info.index}
                            className='mx-1'
                            // size="xl"
                            action="primary"
                            variant={selectedSettings == info.index ? "solid" : "outline"}
                            onPress={() => setSelectedSettings(info.index)}>
                              <ButtonText>{info.item}</ButtonText>
                          </Button>
                        )}
                      />
                    </VStack>
                  </BoundBox>
                {selectedSettings == 0 &&
                  <EqualizerSettings/>
                }
                </VStack>
            </ScrollView>
        </GestureHandlerRootView>
    </VStack>

  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    //marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    //backgroundColor: 'pink',
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