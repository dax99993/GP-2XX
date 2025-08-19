
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from "react";
import { Dimensions } from 'react-native';
import useOrientation from './useOrientation';


function useDimensions() {
  const {orientation, isLandscape} = useOrientation();
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [isTablet, setIsTablet] = useState(false);

  console.log(ScreenOrientation.Orientation[orientation]);

  useEffect(() => {
    const {height, width} = Dimensions.get("screen");
    setHeight(height);
    setWidth(width);
  }, []);

  useEffect(() => {
    const {height, width} = Dimensions.get("screen");
    setHeight(height);
    setWidth(width);
  }, [orientation]);

  useEffect(()=> {
    setAspectRatio(isLandscape ? width / height : height / width)
  },[height, width, isLandscape])

  useEffect(() => {
    setIsTablet(aspectRatio <= 1.6);
  }, [aspectRatio])

  return {height, width, aspectRatio, isTablet};
}

export default useDimensions;