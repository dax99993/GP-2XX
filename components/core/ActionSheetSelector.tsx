import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";
import { Box } from "../ui/box";
import { VStack } from "../ui/vstack";

type ActionSheetProps = {
    name: string;
    placeholder: string;
    labels: [string, string][];
    onChange: (s: string) => void;
}

function ActionSheetSelector(props: ActionSheetProps) {
    const tabbarHeight = useBottomTabBarHeight();

    const Items = props.labels.map(label => (
        <SelectItem key={label[0]} value={label[0]} label={label[1]}/>
    ));

    return (
        <Box className="bg-secondary-300 mx-3 my-2 px-2 pt-3 rounded-md">
            <VStack style={styles.infoContainer} space="sm">
                <Text size="lg" bold={true}>{props.name}</Text>
                <Select style={styles.controlContainer} onValueChange={props.onChange}>
                    <SelectTrigger variant="underlined" size="xl">
                        <SelectInput placeholder={props.placeholder} size="sm"/>
                    </SelectTrigger>
                    <SelectPortal style={{ paddingBottom: tabbarHeight }}>
                        <SelectBackdrop />
                        <SelectContent>
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {
                                Items
                            }
                        </SelectContent>
                    </SelectPortal>
                </Select>
            </VStack>
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
        marginRight: 15,
    },
    controlContainer: {
        minHeight: 50,
        marginBottom: 15,
    },
});

export default observer(ActionSheetSelector);