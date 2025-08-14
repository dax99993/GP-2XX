import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import EffectChainUnit from "@/components/gp/effect/editEffectChain/EffectChainUnit";
import { Center } from "@/components/ui/center";
import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import Sortable, { SortableGridRenderItem } from 'react-native-sortables';
import { SortableGridDragEndParams } from "react-native-sortables/dist/typescript/types";
import SettingsChainUnit from "./settingsUnit";


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
        <Center className="bg-secondary-0" style={styles.sortableContainer}>
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
    flex:1,
  },
  sortableContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 5,
  },
});

export default observer(EffectChain);