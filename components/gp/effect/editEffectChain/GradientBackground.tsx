import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

export enum Coloring {
    None = 0,
    Send = 1,
    Return = 2,
    SendReturn = 3
}

const GetColors = (option: Coloring) => {
    const color0 = 'transparent';
    const color1 = Colors.fxLoop.inPosition;
    const color2 = Colors.fxLoop.outPosition;

    switch (option) {
        case Coloring.Send:
            return [color1, color0]
        case Coloring.Return:
            return [color0, color2]
        case Coloring.SendReturn:
            return [color1, color2]
        default:
        case Coloring.None:
            return [color0, color0]
    }
}

interface GradientBackgroundProps {
    leftColoring: Coloring,
    rightColoring: Coloring,
}

function GradientBackground({leftColoring, rightColoring, children}: PropsWithChildren<GradientBackgroundProps>) {

  const colorsLeft = GetColors(leftColoring);
  const colorsRight = GetColors(rightColoring);

  return (
      <HStack style={styles.container}>
          <LinearGradient
              colors={[colorsLeft[0], colorsLeft[1]]}
              locations={[0.35, 0.65]}
              //start={{x:0.5, y: 0.5}}
              style={styles.leftBackground}
          >
              <></>
          </LinearGradient>

          <LinearGradient
              colors={[colorsRight[0], colorsRight[1]]}
              locations={[0.35, 0.65]}
              //start={{x:0.5, y: 0.5}}
              style={styles.RightBackground}
          />
          <Center style={{flex:1}}>
            {children}
          </Center>
      </HStack>
  );
};


const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width: '100%',
    height: '100%',
    //flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'orange',
    position: 'relative',
  },
  leftBackground: {
    // flex: 1,
    // height: '100%',
    position: 'absolute',
    left: 0,
    right: '50%',
    top: 0,
    height: '100%',
    width: '50%',
    //backgroundColor: 'red',
  },
  RightBackground: {
    // flex: 1,
    // height: '100%',
    position: 'absolute',
    left: '50%',
    right: -1,
    //right: '100%',
    top: 0,
    height: '100%',
    //backgroundColor: 'pink'
  },
});

export default GradientBackground;