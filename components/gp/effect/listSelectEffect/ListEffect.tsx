import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { EffectsChangeInfo } from "@/constants/EffectsChangeInfo";
import { IEffectChangeInfo } from "@/models/effect/changeEffect/IEffectChangeInfo";
import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";


function ListEffect() {
    if (store.gp200.currentEffect == undefined) {return null}

    const DATA = EffectsChangeInfo[EffectType[store.gp200.currentEffect.type] as keyof typeof EffectsChangeInfo];
    const [filteredData, setFilteredData] = useState<IEffectChangeInfo[]>(DATA);

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
                renderItem={(item) => <ListEffectItem name={item.item.name} id={item.item.id} selected={item.item.name == store.gp200.currentEffect?.name}/>}
                keyExtractor={item => item.name}
                ListHeaderComponent={
                    <SearchBarEffect placeholder="Search effect" onChange={onSearchChange}/>
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

function SearchBarEffect(props: SearchProps) {
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
type ListEffectItemProps = {
    name: string;
    id: number[];
    selected: boolean
}

function ListEffectItem(props: ListEffectItemProps) {
    const router = useRouter();

    const onPress = () => {
        //console.log("Selected ", props.name);
        store.gpActions.ChangeEffect(props.id);
        // go back to edit screen
        router.back();
    };

    const onButtonPress = () => {
        console.log("Button pressed!");
    }

    return (
        <Box className="bg-secondary-0">
            <Box className={`${props.selected ? "bg-info-300" : "bg-secondary-300"} mx-5 my-3 rounded-md`}>
                <TouchableOpacity onPress={onPress}>
                    <HStack className="px-3 py-3" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                        <VStack >
                            <Text size="md" bold={true}>{props.name}</Text>
                            <Text>{"Description"}</Text>
                        </VStack>
                        <Button onPress={onButtonPress} size="md" variant="outline" className={`${props.selected ? "bg-info-200" : "bg-secondary-200"} rounded-md`}>
                            <ButtonText>!</ButtonText>
                        </Button>
                    </HStack>
                </TouchableOpacity>
            </Box>
        </Box>
    );
}


export default observer(ListEffect);