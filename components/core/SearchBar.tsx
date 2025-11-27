import { SearchIcon, XIcon } from "lucide-react-native";
import { useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";

// Search bar
interface SearchBarProps {
    placeholder: string;
    onChange: (s: string) => void;
}

function SearchBar(props: SearchBarProps) {
    const [query, setQuery] = useState("");

    const onChangeText = (q: string) => {
        console.log(q);
        setQuery(q);

        // Execute external callback
        props.onChange(q);
    };
    
    const handleClear = () => {
        setQuery("");

        // Execute external callback
        props.onChange("");
    }

    return (
        <Input style={{flex:1, maxHeight: 30}} className="bg-secondary-300 mx-2 my-3">
            <InputSlot className="pl-3">
                <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField 
                type="text"
                value={query}
                onChangeText={onChangeText}
                placeholder={props.placeholder}
                autoCorrect={false}
                autoComplete="off"
                contextMenuHidden={true}
                spellCheck={false}
                />
            {query !== "" &&
                <InputSlot className="pr-3" onPress={handleClear}>
                    <InputIcon as={XIcon} />
                </InputSlot>
            }
        </Input>
    )
}

export default SearchBar;