// import { createContext, PropsWithChildren, ReactNode, useContext, useState } from "react";
// import { StyleProp, ViewStyle } from "react-native";
// import List from "./List";
// import ListItem from "./ListItem";
// import SearchBar from "./SearchBar";

// // Context type definition
// export interface SearchListContextType<T> {
//     data: Array<T>;
//     selected: string | null;
//     onSearch: (s: string) => void;
//     onClick: (s: string) => void;
// }


// // create generic Context
// function createSearchListContext<T>() {
//     const Context = createContext<SearchListContextType<T> | null>(null);

//     const Provider = ({contextData, children} : {contextData: SearchListContextType<T>, children: ReactNode}) => {
//         const [vaklue, setValue] = useState<T>(contextData);
//         return (
//         <Context.Provider value={contextData}>
//             { children }
//         </Context.Provider>
//         );
//     };

//     // create hook
//     const useSearchList = () => {
//         const context = useContext(Context);

//         if (!context) {
//             throw new Error("Search list context used outside of provider");
//         }

//         return context;
//     }

//     return [useSearchList, Provider] as const;
// }

// export { createSearchListContext };

// // Provider
// interface myprops<T> {
//     data: Array<T>;
//     onSearch: () => void;
//     onClick: () => void;
//     style?: StyleProp<ViewStyle>;
// }

// type SearchListProps<T> = PropsWithChildren<myprops<T>>;

// function SearchList<T>(props: SearchListProps<T>) {
//     const [useSearchContext, searchProvider] = createSearchListContext<T>();
//     // Logic in here
//     //  selected state -> Which item in list is currently selected?
//     //  onClick function -> what happens when an item is clicked
//     //  onSearch -> what does modifying the search bar input does?
//     //  filteredData -> Currently available data to show in list
//     const [selected, setSelected] = useState<string | null>(null);
//     const onClickItem = (s: string) => {
//         setSelected(s);

//         // external action
//         props.onClick();
//     };

//     // create Context provider value
//     const value = {
//         selected: selected,
//         onClick: onClickItem,
//         onSearch: (s: string) => {console.log(s)}
//     };

//     return (
//         <searchProvider >
//             { props.children }
//         </SearchProvider>
//     );
// }


// SearchList.SearchBar = SearchBar;
// SearchList.List = List;
// SearchList.ListItem = ListItem;


// export default SearchList;