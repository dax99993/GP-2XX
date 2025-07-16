import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";

function Search() {
    const [search, setSearch] = useState("");

    return (
        <>
            <TextInput onChange={() => {}}>
                {search}
            </TextInput>
        </>
    )
}

export default Search;