import { Center } from "@/components/ui/center";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";


function EffectState() {
    return (
        <Center className="bg-secondary-300 mx-3 my-2 px-2 py-2 rounded-md">
            <Text bold={true}>{EffectType[store.gp200.current_effect.type]}</Text>
            <Switch
                size="md"
                value={store.gp200.current_effect.state}
                onValueChange={(v) => {
                    console.log(v);
                    store.gpActions.ChangeEffectState(v);
                }}
            />
        </Center>
    );
}

export default observer(EffectState);