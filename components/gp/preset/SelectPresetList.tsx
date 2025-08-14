import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";

interface IChangePreset {
    name: string,
    number: number,
    code: string,
}

function SelectPresetList() {
    //if (store.gp200.currentEffect == undefined) {return null}

    const DATA : IChangePreset[] = store.gp200.presets.map(prst => {
        return {   
            name: prst.name,
            number: prst.number,
            code: prst.bankCode
        }
    })

    const [filteredData, setFilteredData] = useState<IChangePreset[]>(DATA);

    const onSearchChange = (q: string) => {
        if (q === "") {
            setFilteredData(DATA);
        } else {
            const data = DATA.filter(e => e.name.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
            setFilteredData(data);
        }
    }

    return (
        <VStack style={{flex:1}} className="bg-secondary-0">
            <FlatList
                data={filteredData}
                renderItem={(item) => <SelectPresetListItem
                    name={item.item.name} code={item.item.code}
                    number={item.item.number} 
                    //selected={item.item.name == store.gp200.currentPreset?.name}
                />}
                keyExtractor={item => item.name}
                ListHeaderComponent={
                    <SearchBar placeholder="Search preset" onChange={onSearchChange}/>
                }
            />
        </VStack>
    );
}

// Search bar
type SearchProps = {
    placeholder: string;
    onChange: (s: string) => void;
}

function SearchBar(props: SearchProps) {
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
        <Box className="bg-secondary-0 mx-5 my-5">
            <Input style={{flex:1}} className="bg-secondary-300">
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
            </Input>
        </Box>
    )
}

// List item
type ListItemProps = {
    name: string;
    number: number;
    code: string;
    //selected: boolean
}

const SelectPresetListItem = observer((props: ListItemProps) => {

    const onPress = () => {
        //console.log("Selected ", props.name);
        store.gpActions.ChangePreset(props.number);
    };

    // const onButtonPress = () => {
    //     console.log("Button pressed!");
    // }

    const isSelected = props.name == store.gp200.currentPreset?.name;

    return (
        <Box className="bg-secondary-0">
            <Box className={`${isSelected ? "bg-info-300" : "bg-secondary-300"} mx-5 my-3 rounded-md`}>
                <TouchableOpacity onPress={onPress}>
                    <HStack className="px-3 py-3" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                        <VStack >
                            <Text size="md" bold={true}>{props.code}</Text>
                            <Text>{props.name}</Text>
                        </VStack>
                        {/* <Button onPress={onButtonPress} size="md" variant="outline" className={`${isSelected ? "bg-info-200" : "bg-secondary-200"} rounded-md`}>
                            <ButtonText>!</ButtonText>
                        </Button> */}
                    </HStack>
                </TouchableOpacity>
            </Box>
        </Box>
    );
});


export default observer(SelectPresetList);