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

function GetInArrowPosition(pos: number) {
  let top : DimensionValue = '0%';
  let left: DimensionValue = '0%';

  const topPositions: DimensionValue[] = ['-1%', '34%', '69%'];
  const leftPositions: DimensionValue[] = ['3%', '25%', '50.5%', '76.5%'];

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

  const topPositions: DimensionValue[] = ['10%', '46%', '82%'];
  const leftPositions: DimensionValue[] = ['3%', '25%', '50.5%', '76.5%'];

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

  const renderItem = useCallback<SortableGridRenderItem<number>>(
    ({ item }) => {
      const isFixed = item == -1;

      return <Sortable.Handle mode={isFixed ? 'fixed' : 'draggable'}>
        {isFixed &&
          <SettingsChainUnit/>
        }
        {!isFixed &&
          <EffectChainUnit chainID={item} />
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
          <ChainIcon scaleX={1.0} scaleY={0.75} width={'103%'} height={'100%'} style={styles.chainBackground}/>
          <InArrow scaleX={1.0} scaleY={1.0} width={15} style={[styles.arrowBackground, GetInArrowPosition(store.gp200.currentPreset.fxLoop.sendPosition)]}/>
          <OutArrow scaleX={1.0} scaleY={1.0} width={15} style={[styles.arrowBackground, GetOutArrowPosition(store.gp200.currentPreset.fxLoop.returnPosition)]}/>
          <Sortable.Grid
            rowGap={15}
            columnGap={15}
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

const styles = StyleSheet.create({
  baseContainer: {
    //flex:1,
  },
  sortableContainer: {
    //flex: 1,
    paddingLeft: 15,
    paddingRight: 5,
    paddingTop: 15,
    paddingBottom: 15,
  },
  chainBackground: {
    position: 'absolute',
    top: '7.5%',
    left: '1%',
    //backgroundColor: 'pink',
  },
  arrowBackground: {
    position: 'absolute',
  }
});

export default observer(EffectChain);