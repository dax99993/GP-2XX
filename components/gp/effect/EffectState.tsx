import { Center } from "@/components/ui/center";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";


function EffectState() {
    const type = store.gp200.currentEffect ? 
        EffectType[store.gp200.currentEffect.type] :
        "";
    const state = store.gp200.currentEffect ? 
        store.gp200.currentEffect.state :
        false;

    return (
        <Center className="bg-secondary-300 mx-3 my-2 px-2 py-2 rounded-md">
            <Text bold={true}>{type}</Text>
            <Switch
                size="md"
                value={state}
                onValueChange={(v) => {
                    console.log(v);
                    store.gpMidiEncoder.ChangeEffectState(v);
                }}
            />
        </Center>
    );
}

export default observer(EffectState);