import { useCallback } from "react";
import { Dimensions, DimensionValue, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import EffectChainUnit from "@/components/gp/effect/editEffectChain/EffectChainUnit";
import { Center } from "@/components/ui/center";
import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import Sortable, { SortableGridRenderItem } from 'react-native-sortables';
import { SortableGridDragEndParams } from "react-native-sortables/dist/typescript/types";
import SettingsChainUnit from "./SettingsUnit";

import ChainIcon from "@/assets/images/svgs/Chain2.svg";
import InArrow from "@/assets/images/svgs/InArrow.svg";
import OutArrow from "@/assets/images/svgs/OutArrow.svg";
import useOrientation from "@/hooks/useOrientation";

function GetInArrowPosition(pos: number) {
  let top : DimensionValue = '0%';
  let left: DimensionValue = '0%';

  const topPositions: DimensionValue[] = ['10%', '49%', '88%'];
  const leftPositions: DimensionValue[] = ['4%', '27%', '54%', '77.5%'];

  const topPos = Math.floor(pos / 4);
  const topLeft = pos % 4;

  top = topPositions[topPos];
  left = leftPositions[topLeft];

  const style = StyleSheet.create({
    s: {
      top: top,
      left: left,
    }
  });

  return style.s;
}

function GetOutArrowPosition(pos: number) {
  let top : DimensionValue = '0%';
  let left: DimensionValue = '0%';

  const topPositions: DimensionValue[] = ['26.5%', '65%', '104%'];
  const leftPositions: DimensionValue[] = ['4%', '27%', '54%', '77.5%'];

  const topPos = Math.floor(pos / 4);
  const topLeft = pos % 4;

  top = topPositions[topPos];
  left = leftPositions[topLeft];

  const style = StyleSheet.create({
    s: {
      top: top,
      left: left,
    }
  });

  return style.s;
}

function EffectChain() {
  //if (store.gp200.currentPreset == undefined) {return null};

  // Styles
  const {orientation, isLandscape, isTablet} = useOrientation();
  console.log("Orientation", orientation, "is Landscape", isLandscape, "is Tablet", isTablet);

  const {width, height} = Dimensions.get("window");
  console.log("Width", width, "Height", height);

  
  const chainWidth = Math.min(height, width, 400);
  const chainItemSize = chainWidth / 8;
  const chainRowGap = chainItemSize / 2;
  const chainColGap = chainItemSize / 2;
  const arrowSize = chainColGap;
  console.log("ChainWidth", chainWidth, "ChainItemSize", chainItemSize);
  console.log("ChainRowGap", chainRowGap, "ChainColGap", chainColGap, "ArrowSize", arrowSize);

  const styles = StyleSheet.create({
    baseContainer: {
      //maxWidth: isLandscape ? '50%' : '100%',
      justifyContent: 'flex-start',
      //alignItems: 'center',
      //backgroundColor: 'lightgreen',
    },
    sortableContainer: {
      //justifyContent: 'flex-start',
      maxWidth: chainWidth,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      paddingHorizontal: chainColGap,
      paddingVertical: chainColGap,
      //backgroundColor: "#6600ff8f",
    },
    chainBackground: {
      position: 'absolute',
      //width: chainWidth,
    },
    arrowBackground: {
      position: 'absolute',
      //backgroundColor: 'pink'
    }
  })

  const renderItem = useCallback<SortableGridRenderItem<number>>(
    ({ item }) => {
      const isFixed = item == -1;

      return <Sortable.Handle mode={isFixed ? 'fixed' : 'draggable'}>
        {isFixed &&
          <SettingsChainUnit size={chainItemSize}/>
        }
        {!isFixed &&
          <EffectChainUnit chainID={item} size={chainItemSize}/>
        }
      </Sortable.Handle>
    },
    []
  );

  const onDragEnd = useCallback((params: SortableGridDragEndParams<number>) => {
    //'worklet';
    const ids = params.indexToKey.map(i => Number(i));
    // remove the -1 for fixed item 
    const chainOrder = ids.filter(i => i !== -1);
    console.log("New chain order = ", chainOrder);
    store.gpActions.ChangePresetChainOrder(ids);
  }, []);

  // Default values
  const sendPosition = store.gp200.currentPreset ? store.gp200.currentPreset.fxLoop.sendPosition : 0; 
  const returnPosition = store.gp200.currentPreset ? store.gp200.currentPreset.fxLoop.returnPosition: 11; 

  const DATA = 
    store.gp200.currentPreset ? 
      store.gp200.currentPreset.effectsChainOrder
      : Object.values(EffectType).filter(e => typeof e === 'number');
  
  // Add index of Fixed settings
  if (!DATA.includes(-1)) {
    DATA.push(-1);
  }
  console.log("Current chain order", DATA);

    return (
      <GestureHandlerRootView style={styles.baseContainer}>
        <Center className="" style={styles.sortableContainer}>
          <ChainIcon scaleX={1.2} scaleY={0.80}
            height={'100%'} width={'100%'}
            style={styles.chainBackground}
          />
          <InArrow scaleX={1.0} scaleY={1.0}
            height={arrowSize} width={arrowSize}
            style={[styles.arrowBackground, GetInArrowPosition(sendPosition)]}
          />
          <OutArrow scaleX={1.0} scaleY={1.0}
            height={arrowSize} width={arrowSize}
            style={[styles.arrowBackground, GetOutArrowPosition(returnPosition)]}
          />
          <Sortable.Grid
            rowGap={chainRowGap}
            columnGap={chainColGap}
            columns={4}
            data={DATA}
            renderItem={renderItem}
            showDropIndicator
            dropIndicatorStyle={{borderColor: 'white'}}
            onDragEnd={onDragEnd}
            customHandle
          />
        </Center>
      </GestureHandlerRootView>
    )
} 

export default observer(EffectChain);