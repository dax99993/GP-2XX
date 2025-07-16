import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type TopBarProps = {
    left: ReactNode;
    right: ReactNode;
}

function TopBar({left, right}: TopBarProps) {
    return  (
        <View style={styles.container}>
            <View style={styles.leftItem}>
                {left}
            </View>
            <View style={styles.rightItem}>
                {right}
            </View>
        </View>
    )
}

type LeftProps = {
    children: ReactNode;
}

function LeftItems({children}: LeftProps) {
    return (
        <>
            {children}
        </>
    );
}

type RightProps = {
    children: ReactNode;
}

function RightItems({children}: RightProps) {
    return (
        <>
            {children}
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'blue',
        height: 50,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftItem: {
        backgroundColor: 'pink',
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginRight: 10,
    },
    rightItem: {
        backgroundColor: 'orange',
        flex: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    }
});


TopBar.leftItems = LeftItems; 
TopBar.rightItems = RightItems; 

export default TopBar;