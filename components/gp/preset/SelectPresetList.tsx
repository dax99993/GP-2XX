import SearchBar from "@/components/SearchBar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { store } from "@/models/store";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

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
            <SearchBar placeholder="Search preset" onChange={onSearchChange} />
            <FlashList
                data={filteredData}
                drawDistance={1500}
                initialScrollIndex={store.gp200.currentPresetNumber}
                estimatedItemSize={60}
                keyExtractor={item => item.number.toString()}
                renderItem={(item) => 
                    <SelectPresetListItem
                        name={item.item.name}
                        code={item.item.code}
                        number={item.item.number} 
                        selected={item.item.number == store.gp200.currentPresetNumber}
                    />
                }
            />
        </VStack>
    );
}



// List item
type ListItemProps = {
    name: string;
    number: number;
    code: string;
    selected: boolean
}

const SelectPresetListItem = observer((props: ListItemProps) => {

    const router = useRouter();

    const onPress = () => {
        // Go back to edit screen
        router.back();
        store.gpMidiEncoder.ChangePreset(props.number);
    };

    const onLongPress = () => {
        console.log("Long pressed!");
    }


    return (
        <Box className={`${props.selected ? "bg-info-300" : "bg-secondary-300"} mx-1 mb-1`} >
            <TouchableOpacity
                onPress={onPress}
                onLongPress={onLongPress}
            >
                <HStack className="px-2 py-2" style={{justifyContent: 'space-between', alignItems: 'center', }}>
                    <VStack >
                        <Text size="md" bold={true}>{props.code}</Text>
                        <Text size="md">{props.name}</Text>
                    </VStack>
                    {/* Add buttons to do actions */}
                </HStack>
            </TouchableOpacity>
        </Box>
    );
});


export default observer(SelectPresetList);