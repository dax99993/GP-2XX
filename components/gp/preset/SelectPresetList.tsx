import SearchBar from "@/components/SearchBar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useStore } from "@/hooks/useStore";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

interface IChangePreset {
    name: string,
    index: number,
    // code: string,
}

function SelectPresetList() {
    const store = useStore();
    const router = useRouter();
    //if (store.gp200.currentEffect == undefined) {return null}

    // const DATA : IChangePreset[] = store.gp200.presets.map(prst => {name: prst.name});
    const DATA : IChangePreset[] = store.gp200.presets.map((prst, index) => {
        return {
        name: prst.name,
        index: index,
        }
    });

    // const [filteredData, setFilteredData] = useState<IChangePreset[]>(DATA);
    const [filteredData, setFilteredData] = useState<IChangePreset[]>(DATA);

    const onSearchChange = (q: string) => {
        if (q === "") {
            setFilteredData(DATA);
        } else {
            // const data = DATA.filter(name => name.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
            const data = DATA.filter(data => data.name.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
            setFilteredData(data);
        }
    }

    const bankCode = (n: number) => {
        const presetPerNumber = store.gp200.isJR ? 3 : 4;
        const bankNumber = Math.floor(n / presetPerNumber);
        const bankSlot = n % presetPerNumber;
        let bankSlotLetter = "";
        switch(bankSlot) {
            case 0:
                bankSlotLetter = "A";
                break;
            case 1:
                bankSlotLetter = "B";
                break;
            case 2:
                bankSlotLetter = "C";
                break;
            case 3:
                bankSlotLetter = "D";
                break;
        }

        return `${(bankNumber + 1).toString().padStart(2, "0")}-${bankSlotLetter}`;
    }

    return (
        <VStack style={{flex:1}} className="bg-secondary-0">
            <SearchBar placeholder="Search preset" onChange={onSearchChange} />
            <FlashList
                data={filteredData}
                drawDistance={3500}
                initialScrollIndex={store.gp200.currentPresetNumber}
                estimatedItemSize={60}
                keyExtractor={item => item.index.toString()}
                renderItem={(item) => 
                    <SelectPresetListItem
                        name={item.item.name}
                        code={bankCode(item.item.index)}
                        selected={item.index == store.gp200.currentPresetNumber}
                        onPress={() => {
                            // Go back to edit screen
                            router.back();
                            store.gpMidiEncoder.ChangePreset(item.item.index);
                        }}
                    />
                }
            />
        </VStack>
    );
}



// List item
type ListItemProps = {
    name: string;
    code: string;
    selected: boolean;
    onPress: () => void;
}

const SelectPresetListItem = (props: ListItemProps) => {
    return (
        <Box className={`${props.selected ? "bg-info-300" : "bg-secondary-300"} mx-1 mb-1`} >
            <TouchableOpacity
                onPress={props.onPress}
                // onLongPress={onLongPress}
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
}


export default observer(SelectPresetList);