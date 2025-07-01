import { useCallback, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { SortableGridRenderItem } from 'react-native-sortables';
import Sortable from 'react-native-sortables';

const DATA = Array.from({ length: 18 }, (_, index) => `Item ${index + 1}`);

export default function Example() {
    const [color, setColor] = useState('blue');

    const changeColor = () => {
        console.log('press');
    };

  const renderItem = useCallback<SortableGridRenderItem<string>>(
    ({ item }) => (
      <View style={styles.card}>
        <Button color={color} title={item} onPress={changeColor}></Button>
        <Text style={styles.text}>{item}</Text>
      </View>
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
              <Sortable.Grid
                  columnGap={10}
                  columns={3}
                  data={DATA}
                  renderItem={renderItem}
                  rowGap={10}
                  showDropIndicator
              />
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#36877F',
    borderRadius: 10,
    height: 100,
    justifyContent: 'center'
  },
  container: {
    padding: 10
  },
  text: {
    color: 'white',
    fontWeight: 'bold'
  }
});