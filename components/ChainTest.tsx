import { useCallback } from "react";
import { DimensionValue, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Center } from "@/components/ui/center";
import { observer } from "mobx-react-lite";
import Sortable, { SortableGridRenderItem } from 'react-native-sortables';
import { SortableGridDragEndParams } from "react-native-sortables/dist/typescript/types";

import { Text } from "./ui/text";

import ChainIcon from "@/assets/images/svgs/Chain2.svg";
import InArrow from "@/assets/images/svgs/InArrow.svg";

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

interface Props {
    name: string;
}

function AA({name}: Props) {
    return (
      <TouchableOpacity style={{alignItems: 'center'}}>
        <Center className="bg-secondary-100" style={{width: 60, height: 60}}>
            <Text>{name}</Text>
        </Center>
      </TouchableOpacity>

    );
}

function EffectChain() {
  //if (store.gp200.currentPreset == undefined) {return null};

  const DATA = [0,1,2,3,4,5,6,7,8,9,10];
  
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
            <AA name={item.toString()}/>
        }
        {!isFixed &&
            <AA name={item.toString()}/>
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
    //store.gpActions.ChangePresetChainOrder(ids);
  }, []);

    return (
      <GestureHandlerRootView style={styles.baseContainer}>
          {/* <ChainIcon scaleX={1.0} scaleY={0.75} height='100%' width='100%' style={styles.chainBackground}/> */}
          <ChainIcon scaleX={1.0} scaleY={1.0} height='100%' width='100%' style={styles.chainBackground}/>
          <InArrow scaleX={1.0} scaleY={1.0} width={15} style={[styles.arrowBackground, GetInArrowPosition(6)]}/>
          {/* <OutArrow scaleX={1.0} scaleY={1.0} width={15} style={[styles.arrowBackground, GetOutArrowPosition(11)]}/>  */}
          <Sortable.Grid
            rowGap={25}
            columnGap={15}
            columns={4}
            data={DATA}
            renderItem={renderItem}
            showDropIndicator
            dropIndicatorStyle={{borderColor: 'white'}}
            onDragEnd={onDragEnd}
            customHandle
          />
      </GestureHandlerRootView>
    )
} 

const styles = StyleSheet.create({
  baseContainer: {
    flex:1,
    //height: '100%',
    maxWidth: 500,
    //maxHeight: 500,
    backgroundColor: 'lightgreen',
    //alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    //paddingLeft: '0.5%'
    // paddingLeft: 10,
    // paddingRight: 5,
    marginLeft: 10,
    marginRight: 5,
  },
  sortableContainer: {
    alignItems: 'center',
    justifyContent: 'center'
   //flex: 1,
    //paddingLeft: 15,
    // paddingRight: 5,
    //marginTop: 15,
    //paddingTop: 15,
    //paddingBottom: 15,
  },
  chainBackground: {
    //flex:1, 
    position: 'absolute',
    //left: 0,
    //bottom: 0,
    top: '0%',
    //left: '1%',
    backgroundColor: 'pink',
  },
  arrowBackground: {
    position: 'absolute',
  }
});

export default observer(EffectChain);