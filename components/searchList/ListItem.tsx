// import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useSearchList } from "./SearchList";

// type SelectEffectItemProps = {
//     name: string;
// }


// function ListItem(props: SelectEffectItemProps) {
//     const { selected, onClick } = useSearchList();
//     //const [selected, setSelected] = useState(store.gp200.current_effect.name === props.name);

//     const onPress = () => {
//         console.log("Selected ", props.name);
//         onClick(props.name);
//         // update current effect in preset and var
//     };

//     const selected_style = selected ? {backgroundColor: 'red'} : {backgroundColor: 'orange'};

//     return (
//         <TouchableOpacity style={[styles.container, selected_style]}>
//             <View style={styles.selectable}>
//                 <Text style={styles.nameText} onPress={onPress}>{props.name}</Text>
//                 <Text style={styles.descText}>{"asd"}</Text>
//             </View>
//             <Button title={"B"}></Button>
//         </TouchableOpacity>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex:1,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         backgroundColor: 'orange',
//         borderRadius: 5,
//         marginHorizontal: 15,
//         marginVertical: 5,
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//     },
//     selectable: {
//         flexDirection: 'column',
//         backgroundColor: 'pink',
//     },
//     nameText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     descText: {
//         fontSize: 12,
//     }
// })

// export default ListItem;