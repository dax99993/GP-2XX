import Slider from '@react-native-community/slider';
import { observer } from 'mobx-react-lite';
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type ParameterProps = {
    name: string,
    initial_value: number,
};

function Parameter(props: ParameterProps) {
    const [value, setValue] = useState(props.initial_value);
    const text = `${props.name} - ${value}`;

    return  (
        <>
        <View style={styles.container}>
            <Text>{text}</Text>
            <Slider
                //style={{width:200, height:40}}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={value}
                onValueChange={setValue}
            />
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'orange',
    }
});



export default observer(Parameter);