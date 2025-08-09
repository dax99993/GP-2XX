import { Center } from "@/components/ui/center";
import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import Sortable, { SortableGridRenderItem } from "react-native-sortables";
import EffectImage from "../../effect/EffectImage";

const DATA = ["PRE", "WAH", "DST", "AMP", "NR", "CAB", "EQ", "MOD", "DLY", "RVB", "VOL"];

function CtrlEffectUnit() {
    const renderItem = useCallback<SortableGridRenderItem<string>>(({ item }) => {
        //const isFixed = FIXED_ITEMS.includes(item);
        const isFixed = false;
        return (
            <Center>
                <Sortable.Handle mode={isFixed ? 'fixed' : 'draggable'}>
                    <TouchableOpacity onPress={() => console.log(item, "pressed!")} style={{ width: 50, height: 50 }}>
                        <EffectImage type={item} state={true} />
                    </TouchableOpacity>
                </Sortable.Handle>
            </Center>
        );
    }, []);

    return (
        <Center>
            <Sortable.Grid
                columnGap={5}
                customHandle
                columns={6}
                data={DATA}
                renderItem={renderItem}
                rowGap={10}
                showDropIndicator={true}
            />
        </Center>
    );
}

export default CtrlEffectUnit;