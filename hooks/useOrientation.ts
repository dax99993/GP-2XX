import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from "react";


function useOrientation() {
  const [orientation, setOrientation] = useState(ScreenOrientation.Orientation.PORTRAIT_UP);

  console.log(ScreenOrientation.Orientation[orientation]);

  useEffect(() => {
    // Unlock orientation on component mount to allow dynamic changes
    ScreenOrientation.unlockAsync();

    // Add a listener for orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      const orientation = orientationInfo.orientation;
      setOrientation(orientation);
    });

    // Clean up the listener on component unmount
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  return orientation;
}

export default useOrientation;