import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import EffectUnit from "@/components/gp/effect/EffectUnit";
import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import Sortable, { SortableGridRenderItem } from 'react-native-sortables';
import { SortableGridDragEndParams } from "react-native-sortables/dist/typescript/types";

const DATA: number[] = Object.values(EffectType).filter(e => typeof e === 'number');


function EffectChain() {

  const renderItem = useCallback<SortableGridRenderItem<number>>(
    ({ item }) => {
      const s = EffectType[item];
      return <EffectUnit title={s} type={item as EffectType}/>
    },
    []
  );

  const onDragEnd = useCallback((params: SortableGridDragEndParams<number>) => {
    //'worklet';
    const ids = params.indexToKey.map(i => Number(i));
    console.log("New chain order = ", ids);
    // store.gp200.changePresetChainOrder(ids);
    store.gpActions.ChangePresetChainOrder(ids);
  }, []);

    return (
      <GestureHandlerRootView style={{ flex: 1, }}>
        <View style={styles.container}>
          <Sortable.Grid
            columnGap={5}
            columns={4}
            data={DATA}
            renderItem={renderItem}
            rowGap={10}
            showDropIndicator
            onDragEnd={onDragEnd}
          />
        </View>
      </GestureHandlerRootView>
    )
} 

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingVertical: 10,
   // paddingHorizontal: 15,
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: 'pink',
    justifyContent: 'space-evenly',
  },
  text: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default EffectChain;