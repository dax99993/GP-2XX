
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Picker } from "@react-native-picker/picker";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";

type pickerSelectorProps = {
    name: string;
    currentValue: string;
    // first item is the number, second is the label
    labels: [string, string][];
    onChange: (s: string, n: number) => void;
}

function pickerSelector(props: pickerSelectorProps) {

    const pickerItems = props.labels.map(label => (
        <Picker.Item key={label[0]} value={label[0]} label={label[1]}/>
    ));

    return (
        <Box className="bg-secondary-300 mx-3 my-2 px-2 pt-3 pb-3 rounded-md">
            <VStack style={styles.infoContainer}>
                <Text size="lg" bold={true}>{props.name}</Text>
            </VStack>
            <Picker style={styles.controlContainer}
                mode="dialog"
                selectedValue={props.currentValue}
                onValueChange={props.onChange}
            >
                {
                    pickerItems
                }
            </Picker>
        </Box>
    );
}


const styles = StyleSheet.create({
    container: {
        //flex:1,
        flexDirection: 'column',
    },
    infoContainer: {
        marginLeft: 15,
    },
    controlContainer: {
        marginLeft: 15,
        marginRight: 15,
    }
});

export default observer(pickerSelector);