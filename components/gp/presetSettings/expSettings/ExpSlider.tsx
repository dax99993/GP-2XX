import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import RangeSlider from "react-native-sticky-range-slider";

type SliderProps = {
    name: string;
    shownValue?: string;
    // minValue: number;
    // maxValue: number;
    // step: number;
    currentValue: number;
    // onChange: (n:number) => void;
}

const Thumb = (type: "high" | "low") => {
  return (
    <View
     style={[styles.thumb, { backgroundColor: type === "high" ? Colors.fxLoop.outPosition : Colors.fxLoop.inPosition}]}
    />
  )
  // if (type == "high") {
  //   return <Icon as={ArrowUpIcon} color="purple" size="xl"/>
  // } else {
  //   return <Icon as={ArrowDownIcon} color="blue" size="xl"/>
  // }
};
const Rail = () => <View style={styles.rail} />;
const RailSelected = () => <View style={styles.railSelected} />;

function ExpSlider(props: SliderProps) {
    // Replace this with values from store
    const [lowValue, setLowValue] = useState(5);
    const [highValue, setHighValue] = useState(70);

    const handleValueChange = useCallback((newLow: number, newHigh: number) => {
      // Update the model through action
        setLowValue(newLow);
        setHighValue(newHigh);
    }, []);

    return (
        <Box className="bg-secondary-300 mx-3 my-2 px-2 pt-3 pb-5 rounded-md">
            <VStack style={styles.infoContainer}>
                <Text size="lg" bold={true}>{props.name}</Text>
                <Text></Text>
            </VStack>
            <RangeSlider style={styles.controlContainer}
                min={0}
                max={100}
                step={1}
                low={lowValue}
                high={highValue}
                onValueChanged={handleValueChange}
                renderThumb={Thumb}
                renderLowValue={(value) => <Text style={styles.valueText}>{value}</Text>}
                renderHighValue={(value) => <Text style={styles.valueText}>{value}</Text>}
                renderRail={Rail}
                renderRailSelected={RailSelected}
            />
        </Box>
    );
}

const THUMB_RADIUS = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  infoContainer: {
    marginLeft: 15,
  },
    controlContainer: {
        marginTop: 10,
        marginLeft: 10,
        paddingRight: 20,
    },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  slider: {
    marginVertical: 20,
  },
  valueText: {
    color: "white",
    paddingLeft: 5,
  },
  thumb: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    //borderWidth: 3,
    //borderColor: "white",
    //backgroundColor: "red",
  },
  rail: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "grey",
  },
  railSelected: {
    height: 5,
    backgroundColor: "pink",
  },
});

export default observer(ExpSlider);