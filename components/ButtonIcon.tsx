import { ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import { Box } from "./ui/box";
import { Center } from "./ui/center";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";

type ButtonWithIconProps = {
    title: string;
    icon?: ReactNode;
    onPress: () => void;
}

function ButtonWithIcon(props: ButtonWithIconProps) {
    return (
        <TouchableOpacity style={{flex:1}} onPress={props.onPress}>
            <Box className="bg-secondary-300 mx-3 my-2 px-2 py-2 rounded-md" style={{ flex: 1 }}>
                <HStack style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <Center style={{ flex: 2 }}>
                        <Text>{props.title}</Text>
                    </Center>
                    <Center style={{ flex: 1, alignItems: 'flex-end' }}>
                        {props.icon}
                    </Center>
                </HStack>
            </Box>
        </TouchableOpacity>
    )
}

export default ButtonWithIcon;