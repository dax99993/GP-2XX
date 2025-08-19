import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from "react";


function useOrientation() {
  const [orientation, setOrientation] = useState(ScreenOrientation.Orientation.PORTRAIT_UP);
  const [isLandscape, setIsLandscape] = useState(false);

  console.log(ScreenOrientation.Orientation[orientation]);

  useEffect(() => {
    // Unlock orientation on component mount to allow dynamic changes
    ScreenOrientation.unlockAsync();

    // Add a listener for orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      const newOrientation = orientationInfo.orientation;
      setOrientation(newOrientation);
    });

    // Clean up the listener on component unmount
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  useEffect(()=> {
    setIsLandscape(orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
      orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
    )
  },[orientation])

  return {orientation, isLandscape};
}

export default useOrientation;