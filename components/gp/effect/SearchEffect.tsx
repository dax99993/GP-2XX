import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

type SearchProps = {
    placeholder: string;
    onChange: (s: string) => void;
}

function SearchEffect(props: SearchProps) {
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
        <View style={styles.container}>
            <TextInput style={styles.input}
                value={query}
                onChangeText={onChangeText}
                placeholder={props.placeholder}
                autoCorrect={false}
                autoComplete="off"
                contextMenuHidden={true}
                spellCheck={false}
            />
            <Button title={"x"} onPress={handleClear}></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: "lightblue",
        marginHorizontal: 15,
    },
    input: {
        backgroundColor: 'white',
        minWidth: 200,
        maxWidth: 200,
    }
})


export default SearchEffect;