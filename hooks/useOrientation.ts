import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from "react";
import { Dimensions } from 'react-native';


function useOrientation() {
  const [orientation, setOrientation] = useState(ScreenOrientation.Orientation.PORTRAIT_UP);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  //const [width, setWidth] = useState(Dimensions.get("window")["width"])

  console.log(ScreenOrientation.Orientation[orientation]);

  useEffect(() => {

    // Detect screen orientation
    const updateOrientation = async () => {
      // Unlock orientation on component mount to allow dynamic changes
      const currentOrientation = await ScreenOrientation.getOrientationAsync();
      await ScreenOrientation.unlockAsync();
      console.log("Async orientation", currentOrientation);
      setOrientation(currentOrientation);
      setIsLandscape(currentOrientation == ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        currentOrientation == ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      );
    };

    // Add a listener for orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      console.log("Orientation event", orientationInfo.orientation);
      setOrientation(orientationInfo.orientation);
      setIsLandscape(orientationInfo.orientation == ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientationInfo.orientation == ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      );
    });

    updateOrientation(); // Initial orientation check

     // Detect device type (tablet or phone)
    const checkDeviceType = () => {
      const { width, height } = Dimensions.get('window');
      // A common heuristic for tablets is a larger screen size
      // You might need to adjust these values based on your target devices

      setIsTablet(Math.min(width, height) >= 600); 
      // const aspectRatio = isLandscape ? width / height : height / width;
      // console.log("Aspect ratio", aspectRatio);
      // setIsTablet(aspectRatio <= 1.6);
    };

    checkDeviceType(); // Initial device type check
    const dimensionSubscription = Dimensions.addEventListener('change', checkDeviceType); // Listen for dimension changes


    // Clean up the listener on component unmount
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
      dimensionSubscription.remove();
    };
  }, []);

  return {orientation, isLandscape, isTablet};
}

export default useOrientation;