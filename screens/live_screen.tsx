import { Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

import BoundBox from '@/components/BoundBox';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import useOrientation from '@/hooks/useOrientation';
import { useStore } from '@/hooks/useStore';
import { FlashList } from '@shopify/flash-list';
import { useKeepAwake } from 'expo-keep-awake';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';


interface customButtonProps {
  text: string,
  selected: boolean,
  onPress: () => void,
}

const CustomButton = (props: customButtonProps) => {
  const color = props.selected ? "bg-success-300" : "bg-info-300";

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={props.onPress}
    >
      <Box 
        className={`py-3 px-5 rounded-md ${color}`}
        style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
        <Center>
          <Text size="3xl">{props.text}</Text>
        </Center>
      </Box>
    </TouchableOpacity>
  );
};

const BankItem = ({bank, selected, presetNames, onPress}: {bank: number, selected: boolean, presetNames: String[], onPress: ()=>void}) => {
  const bankStr = bank.toString().padStart(2, "0");
  const color = selected ? "bg-success-400" : "bg-info-400"

  return (
    <TouchableOpacity style={{flex: 1}}
      onPress={() => {
        onPress();
      }}
    >
      <HStack space= "xl"
        className={`${color} py-2 mx-3 px-5`}
        style={{flex: 1, justifyContent: 'space-between' }}
      >
        <HStack>
          <Heading size='2xl'>{bankStr}</Heading>
        </HStack>
          <VStack style={{flex:1, justifyContent: 'space-between', }}>
            <Text size="md" lineBreakMode='tail' numberOfLines={1}>{`${bankStr}-A ${presetNames[0]}`}</Text>
            <Text size="md" lineBreakMode='tail' numberOfLines={1}>{`${bankStr}-B ${presetNames[1]}`}</Text>
          </VStack>
          <VStack style={{flex: 1, justifyContent: 'space-between', }}>
            <Text size="md" lineBreakMode='tail' numberOfLines={1}>{`${bankStr}-C ${presetNames[2]}`}</Text>
            {presetNames.length == 4 &&
            <Text size="md" lineBreakMode='tail' numberOfLines={1}>{`${bankStr}-D ${presetNames[3]}`}</Text>
            }
          </VStack>
        </HStack>
    </TouchableOpacity>
  );
}


const BankSelector = ({currentBankNumber, presetNames, onPress, presetsPerBank}: {currentBankNumber: number, presetNames: string[], onPress: (bankNumber: number)=>void, presetsPerBank: number}) => {
  const DATA: number[] = useMemo(() => Array.from({ length: presetsPerBank == 3 ? 85 : 64 }, (_, i) => i), []); 
  const refList = useRef<FlashList<any>>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    console.log("Initial bank list load");

    const timeout = setTimeout(() => {
      console.log("Initial scroll to item", currentBankNumber);

      setLoading(false);

      refList.current?.scrollToIndex({
        animated: true,
        index: currentBankNumber,
        viewPosition: 0.5,
      });

    }, 750);

    // return clearTimeout(timeout);
  }, [])

  useEffect(() => {
    console.log("Changed bank", currentBankNumber);

    refList.current?.scrollToIndex({
      animated: true,
      index: currentBankNumber,
      viewPosition: 0.5
    });

  },[currentBankNumber]);

  return (
    <>
    {loading && <Spinner/>}
    {!loading &&
      <FlashList
        ref={refList}
        data={DATA}
        extraData={currentBankNumber}
        initialScrollIndex={currentBankNumber}
        drawDistance={1000}
        estimatedItemSize={56}
        renderItem={(item) => (
          <BankItem 
            bank={item.index + 1}
            selected={currentBankNumber === item.index}
            presetNames={
              presetNames.slice(item.index * presetsPerBank, item.index * presetsPerBank + presetsPerBank)
            }
            onPress={() => {
              onPress(item.index);
            }}
          />)
        }
      />
    }
    </>
  );
}

export const LiveScreen = observer(() => {
  // Keep screen awke all the time
  useKeepAwake();

  const store = useStore();
  const orientation = useOrientation();

  const incrementBank = () => {
    store.gpMidiEncoder.NextBank();
    console.log("Setting bank to", store.gp200.currentPresetBankCode);
  }

  const decrementBank = () => {
    store.gpMidiEncoder.PrevBank();
    console.log("Setting bank to", store.gp200.currentPresetBankCode);
  }

  const changeToBankSlot = (slot: number) => {
    // Get current bank preset num
    const bankPresetNum = store.gp200.currentPresetBankNumber;
    if (bankPresetNum === undefined) {
      return ;
    }

    let presetChangeNum = 0;
    if (store.gp200.isJR) {
      presetChangeNum = bankPresetNum * 3 + (slot % 3);
    } else {
      presetChangeNum = bankPresetNum * 4 + (slot % 4);
    }

    console.log("Change preset to", presetChangeNum);
    store.gpMidiEncoder.ChangePreset(presetChangeNum);
  }


  return (
      <VStack className="bg-secondary-0" style={styles.maincontainer}>
        <View style={{flex:1, flexDirection: orientation.isLandscape ? "row" : "column"}}>
        <Box style={{flex:1}}>
        <BoundBox>
          <Center>
            <Heading size="2xl">
              {`Preset: ${store.gp200.currentPresetBankCode}`}
            </Heading>
            <Heading size="2xl">
              {store.gp200.currentPreset?.name}
            </Heading>
          </Center>
        </BoundBox>
        <Box className="mx-5 my-5">
          <HStack space="2xl" style={{ justifyContent: 'space-between' }}>
            <CustomButton
              text={"Prev Bank"}
              selected={false}
              onPress={() => {
                console.log("Prev Bank");
                decrementBank();
              }}
            />
            <CustomButton
              text={"Next Bank"}
              selected={false}
              onPress={() => {
                console.log("Prev Bank");
                incrementBank();
              }}
            />
          </HStack>
        </Box>
        <Box className="mx-5 my-5">
          <HStack space="2xl" style={{ justifyContent: 'space-between' }}>
            <CustomButton
              text={"A"}
              selected={store.gp200.currentPresetBankSlotNumber === 0}
              onPress={() => {
                console.log("Slot A");
                changeToBankSlot(0);
              }}
            />
            <CustomButton
              text={"B"}
              selected={store.gp200.currentPresetBankSlotNumber === 1}
              onPress={() => {
                console.log("Slot B");
                changeToBankSlot(1);
              }}
            />
            <CustomButton
              text={"C"}
              selected={store.gp200.currentPresetBankSlotNumber === 2}
              onPress={() => {
                console.log("Slot C");
                changeToBankSlot(2);
              }}
            />
            {!store.gp200.isJR &&
            <CustomButton
              text={"D"}
              selected={store.gp200.currentPresetBankSlotNumber === 3}
              onPress={() => {
                console.log("Slot D");
                changeToBankSlot(3);
              }}
            />
            }
          </HStack>
        </Box>
      </Box>
      <Box className="pb-3" style={{flex:1, }}>
        <BoundBox>
          <Center>
            <Heading size="2xl">
              Select Bank
            </Heading>
          </Center>
        </BoundBox>
        <BankSelector
          currentBankNumber={
            store.gp200.currentPresetBankNumber ?? 0 
          }
          presetNames={
            store.gp200.presets.map(p => p.name)
          }
          presetsPerBank={
            store.gp200.isJR ? 3 : 4
          }
          onPress={(bankNumber: number) => {
            if (store.gp200.isJR) {
              store.gpMidiEncoder.ChangePreset(bankNumber * 3);
            } else {
              store.gpMidiEncoder.ChangePreset(bankNumber * 4);
            }
          }}
        />
      </Box>
      </View>
    </VStack>
  );
});


const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    //backgroundColor: 'pink',
  },
  bannerContainer: {
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  viewButtons: {
    backgroundColor: 'green',
    justifyContent: 'space-between',
  }
});
