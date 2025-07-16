import { PropsWithChildren } from "react";
import { FlatList } from "react-native";

interface IList<T> {
    data: Array<T>;

}

type ListProps<T> = PropsWithChildren<IList<T>>

function List<T>(props: ListProps<T>) {
    return (
        <>
        <FlatList
            data={props.data}
            //renderItem={() => props.children}
        />

        </>
    )
}


export default List;