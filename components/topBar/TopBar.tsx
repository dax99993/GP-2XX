import { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { HStack } from "../ui/hstack";

type TopBarProps = {
    children: ReactNode;
}

function TopBar({children}: TopBarProps) {
    return  (
        <HStack style={styles.container} className="bg-secondary-0 px-3 py-1">
            {children}
        </HStack>
    )
}

type LeftProps = {
    children: ReactNode;
}

function LeftItems({children}: LeftProps) {
    return (
        <HStack style={styles.leftItem} className="mr-0">
            {children}
        </HStack>
    );
}

type CenterProps = {
    children: ReactNode
    style?: StyleProp<ViewStyle>
}

function CenterItems({children, style}: CenterProps) {
    return (
        <HStack style={[styles.centerItem, style]} className="mx-2">
            {children}
        </HStack>
    );
}

type RightProps = {
    children: ReactNode;
}

function RightItems({children}: RightProps) {
    return (
        <HStack style={styles.rightItem} className="ml-0">
            {children}
        </HStack>
    );
}


const styles = StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    leftItem: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: 'orange'
    },
    centerItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'pink'
    },
    rightItem: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: 'orange'
    }
});


TopBar.leftItems = LeftItems; 
TopBar.centerItems = CenterItems; 
TopBar.rightItems = RightItems; 

export default TopBar;