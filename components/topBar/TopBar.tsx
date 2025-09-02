import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { HStack } from "../ui/hstack";

type TopBarProps = {
    children: ReactNode;
}

function TopBar({children}: TopBarProps) {
    return  (
        <HStack style={styles.container} className="bg-secondary-0 px-2 py-1">
            {children}
        </HStack>
    )
}

type LeftProps = {
    children: ReactNode;
}

function LeftItems({children}: LeftProps) {
    return (
        <HStack style={styles.leftItem} className="mr-1">
            {children}
        </HStack>
    );
}

type CenterProps = {
    children: ReactNode
}

function CenterItems({children}: CenterProps) {
    return (
        <HStack style={styles.centerItem} className="mr-2 ml-2">
            {children}
        </HStack>
    );
}

type RightProps = {
    children: ReactNode;
}

function RightItems({children}: RightProps) {
    return (
        <HStack style={styles.rightItem} className="ml-1">
            {children}
        </HStack>
    );
}


const styles = StyleSheet.create({
    container: {
        //height: '12%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //backgroundColor: 'pink'
    },
    leftItem: {
        //flex: 1,
        //flexGrow: 1,
        //flexShrink: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        //backgroundColor: 'orange'
    },
    centerItem: {
        flex: 1,
        //flexGrow: 0,
        flexShrink: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        //backgroundColor: 'lightgreen'
    },
    rightItem: {
        flex: 1,
        //flexGrow: 0,
        flexShrink: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        //backgroundColor: 'skyblue'
    }
});


TopBar.leftItems = LeftItems; 
TopBar.centerItems = CenterItems; 
TopBar.rightItems = RightItems; 

export default TopBar;