import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useScrolling } from "@/contexts/scroll-context";
import { Combox } from "@/models/parameter/Combox";
import { ParamType } from "@/models/parameter/IParameter";
import { Switch as SwitchParam } from "@/models/parameter/Switch";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { ScrollView, StyleSheet } from "react-native";
import NumericParameter from "../parameter/NumericParameter";
import SelectParameter from "../parameter/SelectParameter";
import SwitchParameter from "../parameter/SwitchParameter";
import EffectSelector from "./EffectSelector";
import EffectState from "./EffectState";

function EffectEdit() {
    const { isScrollingEnabled } = useScrolling();

    return (
        <VStack style={styles.mainContainer} className="bg-secondary-0">
            <HStack style={styles.selectionContainer} >
                <EffectState/>
                <EffectSelector/>
            </HStack>
            <ScrollView style={styles.parametersContainer}
                scrollEnabled={isScrollingEnabled}
            >
                { store.gp200.currentEffect && store.gp200.currentEffect.parameters.map(p => {
                    if (p.type === ParamType.Knob && !store.gp200.currentEffect?.activeBindParams.includes(p.ID)) {
                        return <NumericParameter
                            key={p.name}
                            param={p}
                        />
                    } else if (p.type === ParamType.Slider) {
                        return <NumericParameter
                            key={p.name}
                            param={p}
                        />
                    } else if(p.type === ParamType.Combox) {
                        if (
                            (!store.gp200.currentEffect?.hasBindParameters) ||
                            (store.gp200.currentEffect?.hasBindParameters && store.gp200.currentEffect?.activeBindParams.includes(p.ID))
                        ) {
                            return <SelectParameter
                                key={p.name}
                                param={p as Combox}
                            />
                        }
                    } else if (p.type === ParamType.Switch) {
                        return <SwitchParameter
                            key={p.name}
                            param={p as SwitchParam}
                        />
                    }
                }) 
                }
            </ScrollView>
        </VStack>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    selectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stateContainer: {
        flexDirection: 'column',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    parametersContainer: {
        flexDirection: 'column',
    }

});


export default observer(EffectEdit);