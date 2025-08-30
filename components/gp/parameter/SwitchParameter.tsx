import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useScrolling } from "@/contexts/scroll-context";
import { Switch as SwitchParam } from "@/models/parameter/Switch";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";

type SwitchParameterProps = {
    param: SwitchParam
}

function SwitchParameter({param}: SwitchParameterProps) {

    const { enableScrolling, disableScrolling} = useScrolling();

    const getStringValue = param.getCurrentValueAsString();

    return (
        <Box className="bg-secondary-300 mx-3 my-2 px-2 pt-3 pb-3 rounded-md">
            <HStack style={styles.infoContainer}>
                <Text size="lg" bold={true}>{param.name}</Text>
                {/* <Text size="lg" bold={true}>{getStringValue}</Text> */}
                <Switch
                    style={{ marginRight: 5 }}
                    size="lg"
                    isDisabled={false}
                    trackColor={{ true: '#d4d4d4', false: '#525252' }}
                    thumbColor="#fafafa"
                    // activeThumbColor="#fafafa"
                    ios_backgroundColor="#d4d4d4"
                    value={param.currentValue != 0}
                    onValueChange={(n: boolean) => {
                        store.gpActions.ChangeEffectParamValue(param.ID, "float", Number(n));
                    }}
                />
            </HStack>
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    infoContainer: {
        marginLeft: 15,
        justifyContent: 'space-between'
    },
});

export default observer(SwitchParameter);