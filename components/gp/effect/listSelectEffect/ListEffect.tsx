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
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";

type ListEffectProps = {
    data: string[];
}

type EffectData = {
    name: string;
    id: number;
}


function ListEffect(props: ListEffectProps) {
    const DATA = useMemo(() => {
        //return EffectsNames[EffectType[store.gp200.current_effect.type] as keyof typeof EffectsNames];
        return EffectsChangeInfo[EffectType[store.gp200.currentEffect.type] as keyof typeof EffectsChangeInfo];
    }, [store.gp200.currentEffect]);

    //const [filteredData, setFilteredData] = useState<string[]>(DATA);
    const [filteredData, setFilteredData] = useState<IEffectChangeInfo[]>(DATA);


    const onSearchChange = (q: string) => {
        if (q === "") {
            setFilteredData(DATA);
        } else {
            //const n = DATA.filter(e => e.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
            const n = DATA.filter(e => e.name.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
            setFilteredData(n);
        }
    }

    return (
        <VStack style={{flex:1}} className="bg-secondary-0">
            <FlatList
                data={filteredData}
                renderItem={(item) => <ListEffectItem name={item.item.name} id={item.item.id}/>}
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
}

function ListEffectItem(props: ListEffectItemProps) {
    const [selected, setSelected] = useState(store.gp200.currentEffect.name === props.name);

    const onPress = () => {
        console.log("Selected ", props.name);
        // update current effect in preset and var
        //store.gp200.changeEffect(props.name, store.gp200.current_effect.type);
        store.gpActions.ChangeEffect(props.id);

        setSelected(store.gp200.currentEffect.name === props.name);
        // on Press end
    };

    const onButtonPress = () => {
        console.log("Button pressed!");
    }

    return (
        <Box className="bg-secondary-0">
            <Box className={`${selected ? "bg-info-300" : "bg-secondary-300"} mx-5 my-3 rounded-md`}>
                <TouchableOpacity onPress={onPress}>
                    <HStack className="px-3 py-3" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                        <VStack >
                            <Text size="md" bold={true}>{props.name}</Text>
                            <Text>{"Description"}</Text>
                        </VStack>
                        <Button onPress={onButtonPress} size="md" variant="outline" className={`${selected ? "bg-info-200" : "bg-secondary-200"} rounded-md`}>
                            <ButtonText>!</ButtonText>
                        </Button>
                    </HStack>
                </TouchableOpacity>
            </Box>
        </Box>
    );
}


export default observer(ListEffect);