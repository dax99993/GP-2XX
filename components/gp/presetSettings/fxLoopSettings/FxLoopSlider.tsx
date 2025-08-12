import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
//import { Slider } from '@miblanchard/react-native-slider';
import { RangeSlider } from '@react-native-assets/slider';
import * as RN from 'react-native';
import { StyleSheet, View } from 'react-native';

interface Props {
    name: string;
    minValue: number;
    maxValue: number;
    step: number;
    lowValue: number;
    highValue: number;
    onChange: (values: number[]) => void;
    //onChange: (low: number, high: number) => void;
}

const Thumb = (t: {value: number, thumb: "min" | "max"}) => {
  return (
    <Center
     style={[styles.thumb, { backgroundColor: t.thumb=== "max" ? Colors.fxLoop.outPosition : Colors.fxLoop.inPosition, alignItems:'center'}]}
    >
      <Text size='xl'>{t.value + 1}</Text>
    </Center>
  )
}

interface ITrack {
    length: number;
    thickness: number;
    vertical: boolean;
    track: 'min' | 'max' ;
    style: RN.StyleProp<RN.ViewStyle>;
    color: RN.ColorValue;
}

const Track = (t: ITrack) => {
    return (
        <></>
    );
}

interface IStepMarker {
  stepMarked: boolean;
  currentValue: [number, number];
  index: number;
  min: number;
  max: number;
  markValue: number;
}

const StepMarker = (props: IStepMarker) => {
  console.log("Step props", props);
  return (
    <View>
      {!props.stepMarked &&
        <Center style={{ width:20, height: 20 , backgroundColor: '' }}>
          <Text size='md'>{props.markValue + 1}</Text>
        </Center>
      }
    </View>
  );
}

const Rail = () => <View style={styles.rail} />;
const RailSelected = () => <View style={styles.railSelected} />;

function FxLoopSlider(props: Props) {
    return (
        <Box className="bg-secondary-300 mx-3 my-2 px-2 pt-3 pb-5 rounded-md">
            <VStack style={styles.infoContainer}>
                <Text size="lg" bold={true}>{props.name}</Text>
                <Text></Text>
            </VStack>
        <RangeSlider style={styles.controlContainer}
            minimumValue={props.minValue}
            maximumValue={props.maxValue}
            step={props.step}
            range={[props.lowValue, props.highValue]}
            minimumRange={0}
            onSlidingComplete={props.onChange}
            inboundColor={'white'}
            outboundColor={'gray'}
            trackHeight={5}
            CustomThumb={Thumb}
            StepMarker={StepMarker}
        />
        </Box>
    );
}

const THUMB_RADIUS = 15;

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
        //paddingLeft:20,
        //paddingRight: 20,
        marginLeft: 20,
        marginRight: 20,
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

export default FxLoopSlider;