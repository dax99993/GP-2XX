import { useCallback } from "react";
import { DimensionValue, StyleSheet } from "react-native";
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
import useDimensions from "@/hooks/useDimensions";
import useOrientation from "@/hooks/useOrientation";

function GetInArrowPosition(pos: number) {
  let top : DimensionValue = '0%';
  let left: DimensionValue = '0%';

  const topPositions: DimensionValue[] = ['-3%', '36%', '75%'];
  const leftPositions: DimensionValue[] = ['-5%', '20%', '47%', '74%'];

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

  const topPositions: DimensionValue[] = ['14%', '53%', '92%'];
  const leftPositions: DimensionValue[] = ['-5%', '20%', '47%', '74%'];

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
  if (store.gp200.currentPreset == undefined) {return null};

  const DATA = 
    store.gp200.currentPreset ? 
      store.gp200.currentPreset.effectsChainOrder
      : Object.values(EffectType).filter(e => typeof e === 'number');
  
  // Add index of Fixed settings
  if (!DATA.includes(-1)) {
    DATA.push(-1);
  }

  console.log("Current chain order", DATA);

  // Styles
  const {orientation, isLandscape} = useOrientation();
  const {height, width, aspectRatio, isTablet} = useDimensions();

  console.log("Height", height, "Width", width);
  console.log("Orientation", orientation, "is Landscape", isLandscape);
  console.log("Aspect Ratio", aspectRatio, "is Tablet", isTablet);

  const scale = 1.5; //when used in bigger screen tablets
  const chainWidth = 400;
  const chainItemSize = isTablet? scale * chainWidth / 8: chainWidth / 8;
  const chainRowGap = isTablet ? scale * chainItemSize / 2 : chainItemSize / 2;
  const chainColGap = isTablet ? scale * chainItemSize / 2 : chainItemSize / 2;
  const arrowSize = chainColGap;

  const styles = StyleSheet.create({
    baseContainer: {
      // maxWidth: isLandscape ? (isTablet ? '40%': '50%') : '100%',
      maxWidth: isTablet ? scale * chainWidth: chainWidth,
      justifyContent: isLandscape ? 'center': 'flex-start',
      alignItems: 'center',
      alignContent: 'center',
      paddingHorizontal: chainColGap,
      paddingVertical: chainColGap,
      //backgroundColor: 'lightgreen',
    },
    sortableContainer: {
      //alignItems: 'center',
      justifyContent: 'flex-start',
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

    return (
      <GestureHandlerRootView style={styles.baseContainer}>
        <Center className="" style={styles.sortableContainer}>
          <ChainIcon scaleX={1.2} scaleY={0.80}
            height={'100%'} width={'100%'}
            style={styles.chainBackground}
          />
          <InArrow scaleX={1.0} scaleY={1.0}
            height={arrowSize} width={arrowSize}
            style={[styles.arrowBackground, GetInArrowPosition(store.gp200.currentPreset.fxLoop.sendPosition)]}
          />
          <OutArrow scaleX={1.0} scaleY={1.0}
            height={arrowSize} width={arrowSize}
            style={[styles.arrowBackground, GetOutArrowPosition(store.gp200.currentPreset.fxLoop.returnPosition)]}
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