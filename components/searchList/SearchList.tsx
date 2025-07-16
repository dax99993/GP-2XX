import { PropsWithChildren } from "react";

interface myprops {
    onSearch: () => void;
}

type SearchListProps = PropsWithChildren<myprops>;

function SearchList(props: SearchListProps) {
    // Logic in here
    // Context provider

    
    return (
        <>
        { props.children }
        </>
    );
}

export default SearchList;