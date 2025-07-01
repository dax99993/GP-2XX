import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";


const DATA = Array.from(['PRE', 'WAH', 'DST', 'AMP', 'NR', 'CAB', 'EQ', 'MOD', 'DLY', 'RVB', 'VOL']);

import EffectUnit from "@/components/gp/EffectUnit";
import Sortable, { SortableGridRenderItem } from 'react-native-sortables';

function EffectChain() {

  const renderItem = useCallback<SortableGridRenderItem<string>>(
    ({ item }) => (
      <EffectUnit title={item} effecttype={item.toLocaleLowerCase()}/>
    ),
    []
  );

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Sortable.Grid
            columnGap={10}
            columns={4}
            data={DATA}
            renderItem={renderItem}
            rowGap={10}
            showDropIndicator
          />
        </View>
      </GestureHandlerRootView>
    )
} 

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'pink',
  },
  text: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default EffectChain;