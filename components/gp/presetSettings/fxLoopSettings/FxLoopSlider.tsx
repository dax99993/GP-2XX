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
    onSlidingStart?: (values: [number, number]) => void;
    onSlidingComplete?: (values: [number, number]) => void;
    onValueChange?: (values: [number, number]) => void;
}

const Thumb = (t: {value: number, thumb: "min" | "max"}) => {
  return (
    <Center
     style={[styles.thumb,
      { backgroundColor: t.thumb=== "max" ? Colors.fxLoop.outPosition : Colors.fxLoop.inPosition, alignItems:'center'}]}
    >
      <Text size='xl' bold={true}>{t.value + 1}</Text>
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
  //console.log("Step props", props);
  return (
    <View>
      {!props.stepMarked &&
        <Center style={{ width:20, height: 20 , marginTop: 8, backgroundColor: '' }}>
          <Text size='lg'>{props.markValue + 1}</Text>
        </Center>
      }
    </View>
  );
}

function FxLoopSlider(props: Props) {
    return (
        <Box className="bg-secondary-300 mx-3 my-2 px-2 pt-3 pb-5 rounded-md">
            <VStack style={styles.infoContainer}>
                <Text size="lg" bold={true}>{props.name}</Text>
            </VStack>
        <RangeSlider style={styles.controlContainer}
            minimumValue={props.minValue}
            maximumValue={props.maxValue}
            step={props.step}
            range={[props.lowValue, props.highValue]}
            minimumRange={0}
            onSlidingStart={(range) => {
              if (props.onSlidingStart) props.onSlidingStart(range);
            }}
            onValueChange={(range) => {
              if (props.onValueChange) props.onValueChange(range);
            }}
            onSlidingComplete={(range) => {
              if (props.onSlidingComplete) props.onSlidingComplete(range);
            }}
            inboundColor={'white'}
            outboundColor={'gray'}
            trackHeight={15}
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
        marginLeft: 15,
        marginRight: 15,
    },
  thumb: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    //borderWidth: 3,
    //borderColor: 'lightgray',
  },
});

export default FxLoopSlider;