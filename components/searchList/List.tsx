// import { PropsWithChildren } from "react";
// import { FlatList, ListRenderItem } from "react-native";

// interface IList<T> {
//     data: Array<T>;
//     selectedValue: T;
//     renderItem: ListRenderItem<T>;
// }

// type ListProps<T> = PropsWithChildren<IList<T>>

// function List<T>(props: ListProps<T>) {
//     return (
//         <>
//         <FlatList
//             data={props.data}
//             renderItem={props.renderItem}
//             keyExtractor={(item, index) => index.toString()}
//         />

//         </>
//     )
// }


// export default List;