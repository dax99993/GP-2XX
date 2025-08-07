import { ViewStyle } from "react-native";
import { Box } from "./ui/box";

interface BoundBoxProps {
    style?: ViewStyle;
}

function BoundBox({style, children}: React.PropsWithChildren<BoundBoxProps>) {
    return (
        <Box className="bg-secondary-300 mx-3 my-2 px-2 pt-3 pb-5 rounded-md" > 
            {children}
        </Box>
    )
}

export default BoundBox;