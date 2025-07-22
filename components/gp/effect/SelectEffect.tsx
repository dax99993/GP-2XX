import { EffectsNames } from "@/constants/EffectsNames";
import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import SearchEffect from "./SearchEffect";
import SelectEffectItem from "./SelectEffectItem";

type SelectEffectProps = {
    data: string[];
}

type EffectData = {
    name: string;
    id: number;
}


function SelectEffect(props: SelectEffectProps) {
    //const DATA = EffectsNames[EffectType[store.gp200.current_effect.type] as keyof typeof EffectsNames];
    const [data, setData] = useState<string[]>(EffectsNames[EffectType[store.gp200.current_effect.type] as keyof typeof EffectsNames]);

    //useEffect(, [store.current])

    const handleSearch = (q: string) => {
        if (q === "") {
            const n = EffectsNames[EffectType[store.gp200.current_effect.type] as keyof typeof EffectsNames];
            setData(n);
        } else {
            const n = EffectsNames[EffectType[store.gp200.current_effect.type] as keyof typeof EffectsNames].filter(e => e.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
            setData(n);
        }
    }

    return (
        <View style={styles.container}>
            <SearchEffect placeholder="Search effect" onChange={handleSearch}/>
            <FlatList
                data={data}
                renderItem={(item) => <SelectEffectItem name={item.item}/>}
                keyExtractor={item => item}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        paddingVertical: 20,
    }
})

export default SelectEffect;