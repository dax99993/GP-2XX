import { Platform, StatusBar, StyleSheet } from 'react-native';

import BoundBox from '@/components/BoundBox';
import CtrlsSettings from '@/components/gp/presetSettings/ctrlSettings/CtrlsSettings';
import ExpsSettings from '@/components/gp/presetSettings/expSettings/ExpsSettings';
import FxLoopSettings from '@/components/gp/presetSettings/fxLoopSettings/FxLoopSettings';
import GeneralSettings from '@/components/gp/presetSettings/generalSettings/GeneralSettings';
import KnobsSettings from '@/components/gp/presetSettings/knobSettings/knobsSettings';
import { Button, ButtonGroup, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { useScrolling } from '@/contexts/scroll-context';
import useOrientation from '@/hooks/useOrientation';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';



export default function PresetSettings() {
  const { isScrollingEnabled, enableScrolling, disableScrolling} = useScrolling();
  const {isLandscape} = useOrientation();
  const [selectedSettings, setSelectedSettings] = useState(0);
  const presetScrollButtonsRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (selectedSettings >= 2) {
      presetScrollButtonsRef.current?.scrollToEnd();
      //presetScrollButtonsRef.current?.scrollTo({y: 30 * 2, animated: true});
    } else {
      presetScrollButtonsRef.current?.scrollTo({y: 0 , animated: true});
    }
  }, [selectedSettings, isLandscape])

  //const buttonTitles = isTablet ?  ['General', 'Knobs', 'Ctrls', 'EXPs'] : ['General', 'Knobs', 'Ctrls', 'EXPs', 'FxLoop'];
  const buttonTitles = ['General', 'Knobs', 'Ctrls', 'EXPs', 'FxLoop'];

  return (
    <VStack space='md' className='bg-secondary-0' style={{flex:1}}>

        <GestureHandlerRootView>
            <ScrollView scrollEnabled={isScrollingEnabled}>
                <VStack space='md' className='bg-secondary-0'>
                  <BoundBox style={{ flex: 1, }}>
                    <VStack space='md'>
                      <Center>
                        <Heading>Preset Settings</Heading>
                      </Center>
                      <Center>
                        <ScrollView
                          ref={presetScrollButtonsRef}
                          horizontal={true}
                          style={{ paddingBottom: 10 }}
                        >
                          <ButtonGroup space="md" flexDirection="row" style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
                            {
                              buttonTitles.map((title, index) => (
                                <Button size="md" action="primary" variant={selectedSettings == index ? "solid" : "outline"} onPress={() => setSelectedSettings(index)}>
                                  <ButtonText>{title}</ButtonText>
                                </Button>
                              ))
                            }
                          </ButtonGroup>
                        </ScrollView>
                      </Center>
                    </VStack>
                  </BoundBox>
                {selectedSettings == 0 &&
                  <GeneralSettings/>
                }
                {selectedSettings == 1 &&
                  <KnobsSettings/>
                }
                {selectedSettings == 2 &&
                  <CtrlsSettings/>
                }
                {selectedSettings == 3 &&
                  <ExpsSettings/>
                }
                {selectedSettings == 4 &&
                  <FxLoopSettings/>
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