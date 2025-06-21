import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";


export interface ActionButtonProps {
    onPress: (event: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>;
    title: String;
    type: ActionButtonType;
}

export enum ActionButtonType {
    ControlOff = "controlOff",
    ControlOn = "controlOn",
    Patch = "patch",
    Tap = "tap"
}