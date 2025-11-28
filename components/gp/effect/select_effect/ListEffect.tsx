import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ChangeEffectsInfo } from "@/constants/ChangeEffects";
import { IChangeEffect } from "@/models/effect/changeEffect/IChangeEffects";
import { EffectType } from "@/models/effect/effect";
import { useRouter } from "expo-router";
import { TrashIcon } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useMemo, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";

import SearchBar from "@/components/core/SearchBar";
import { useStore } from "@/hooks/useStore";
import { createHandleToast } from "@/utils/toast";
import { FlashList } from "@shopify/flash-list";



function ListEffect() {
    const store = useStore();

    const handleToast = createHandleToast({
        title: "Dear user",
        description: "This features has not been implemented yet!.",
        duration: 3000
    }, 'bottom');

    // if (store.gp200.currentEffect == undefined) {return null}
    const effectType = store.gp200.currentEffect ? store.gp200.currentEffect.type : EffectType.PRE; 

    const DATA = useMemo(() => {
        return ChangeEffectsInfo[EffectType[effectType] as keyof typeof ChangeEffectsInfo];
    }, []);

    const ID = store.gp200.currentEffect ? store.gp200.currentEffect.ID : DATA[10].ID; 
    const IRNames = store.gp200.irNames;

    const listRef = useRef<FlashList<any>>(null);
    const [filteredData, setFilteredData] = useState<IChangeEffect[]>(DATA);


    // AMP
    // 251658240, 251658241, 251658242, 251658243, 251658244,
    // DST
    // 251658245, 251658246, 251658247, 251658248, 251658249, 
    const isNAM = (ID: number) => (ID >= 251658240 && ID <= 251658249);
    const isIR = (ID: number) => (ID >= 168820736 && ID <= 168820755);
    const getIRIndex = (ID: number) => (ID - 168820736);

    const current_index = filteredData.findIndex(e => e.ID === ID) ;
    console.log("Current effect", store.gp200.currentEffect?.name, current_index);


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
            <SearchBar placeholder="Search effect" onChange={onSearchChange}/>
            <FlashList
                ref={listRef}
                initialScrollIndex={current_index}
                drawDistance={1500}
                estimatedItemSize={60}
                data={filteredData}
                keyExtractor={item => item.name + item.index}
                renderItem={(item) => 
                    <ListEffectItem
                        name={isIR(item.item.ID) ? IRNames[getIRIndex(item.item.ID)] : item.item.name}
                        id={item.item.ID}
                        selected={item.item.ID === ID}
                        description={item.item.description}
                        isDeletable={isIR(item.item.ID) || isNAM(item.item.ID)}
                        onLoadFile={() => {
                            // Show toast Not implemented yet
                            handleToast();
                            if (isIR(item.item.ID)) {
                                return console.log("Delete IR on", item.item.name, item.item.ID);
                            } else if (isNAM(item.item.ID)) {
                                return console.log("Delete NAM on", item.item.name, item.item.ID);
                            }
                        }}
                    />
                }
            />
        </VStack>
    );
}


// List item
type ListEffectItemProps = {
    name: string;
    id: number;
    selected: boolean;
    description: string;
    isDeletable: boolean;
    onLoadFile?: () => void;
}

function ListEffectItem(props: ListEffectItemProps) {
    const store = useStore();
    const router = useRouter();
    const [showFullDescription, setShowFullDescription] = useState(1);

    const onPress = () => {
        //console.log("Selected ", props.name);
        store.gpMidiEncoder.ChangeEffect(props.id);
        // go back to edit screen
        router.back();
    };

    return (
        <Box className={`${props.selected ? "bg-info-300" : "bg-secondary-300"} mx-1 mb-1`}>
            <TouchableOpacity
                style={{ flexDirection: 'row', justifyContent: 'space-between'}}
                onPress={onPress}
                onLongPress={() => setShowFullDescription(1 - showFullDescription)}
            >
                <VStack className="px-2 py-2" >
                    <Text size="md" bold={true}>{props.name}</Text>
                    <Text numberOfLines={showFullDescription}>{props.description}</Text>
                </VStack>
                {props.isDeletable &&
                <UploadItem onPress={props.onLoadFile}/>
                }
            </TouchableOpacity>
        </Box>
    );
}

interface UploadItemProps {
    onPress?: () => void;
}

const UploadItem: React.FC<UploadItemProps> = ({onPress}) => {
    return (
        <TouchableOpacity 
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={onPress}
        >
            <Center className="bg-secondary-500 px-3" style={{flex: 1, }}>
                <Text>Delete</Text>
                <Icon size="xl" as={TrashIcon} />
            </Center>
        </TouchableOpacity>
    )
}


export default observer(ListEffect);