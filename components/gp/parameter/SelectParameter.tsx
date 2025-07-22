import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { SelectParameterModel } from "@/models/parameter/selectParameter";
import { store } from "@/models/store";
import { Picker } from "@react-native-picker/picker";
// import {
//     Select,
//     SelectBackdrop,
//     SelectContent,
//     SelectDragIndicator,
//     SelectDragIndicatorWrapper,
//     SelectInput,
//     SelectItem,
//     SelectPortal,
//     SelectTrigger
// } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";

type SelectParameterProps = {
    param: SelectParameterModel
}

function SelectParameter({param}: SelectParameterProps) {

    const onChangeNumber = (v:string, n: number) => {
       //store.gp200.changeParamValue(param.name, n);
       store.gp200.changeParamValue(store.gp200.current_effect.type, param.id, n);
       console.log(`Select assign value (${param.name})= ${v}, ${n}`);
    };

    const labelEntries = Object.entries(param.labels);
    //console.log("Select labels = ", labelEntries);

    const pickerItems = labelEntries.map(e => (
        <Picker.Item key={e[0]} value={e[0]} label={e[1]}/>
    ));

    return (
        <VStack style={styles.container}>
            <Box className="bg-secondary-0 px-1 py-5">
            <VStack style={styles.infoContainer}>
                <Text size="lg" bold={true}>{param.name}</Text>
            </VStack>
            {
                <Picker style={styles.controlContainer}
                    mode="dropdown"
                    selectedValue={param.current_value[0].toString()}
                    onValueChange={onChangeNumber}
                >
                    {
                        pickerItems
                    }
                </Picker>
            }
            </Box>
        </VStack>
    );
}

// function SelectParameter({param}: SelectParameterProps) {

//     const onChangeNumber = (v:string, n: number) => {
//        //store.gp200.changeParamValue(param.name, n);
//        store.gp200.changeParamValue(store.gp200.current_effect.type, param.id, n);
//        console.log(`Select assign value (${param.name})= ${v}, ${n}`);
//     };

//     const labelEntries = Object.entries(param.labels);

//     const Items = labelEntries.map(e => (
//         <SelectItem key={e[0]} value={e[0]} label={e[1]}/>
//     ));

//     return (
//         <View style={styles.container}>
//             <Text style={styles.infoContainer}>{param.name}</Text>
//             <Select style={styles.controlContainer} onValueChange={onChangeNumber}>
//                 <SelectTrigger variant="outline" size="lg">
//                     <SelectInput placeholder={param.current_value[0].toString()} />
//                 </SelectTrigger>
//                 <SelectPortal>
//                     <SelectBackdrop />
//                     <SelectContent>
//                         <SelectDragIndicatorWrapper>
//                             <SelectDragIndicator />
//                         </SelectDragIndicatorWrapper>
//                         {
//                             Items
//                         }
//                     </SelectContent>
//                 </SelectPortal>
//             </Select>
//         </View>
//     );
// }

const styles = StyleSheet.create({
    container: {
        //flex:1,
        flexDirection: 'column',
        //backgroundColor: 'pink',
        //paddingVertical: 15,
        //marginHorizontal: 10,
    },
    infoContainer: {
        marginLeft: 15,
    },
    controlContainer: {
        //marginTop: 10,
        //paddingTop:10,
        marginLeft: 15,
        marginRight: 30,
    }
});

export default observer(SelectParameter);