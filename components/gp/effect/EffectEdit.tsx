import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { DoubleParameterModel } from "@/models/parameter/doubleParameter";
import { NumericParameterModel } from "@/models/parameter/numericParameter";
import { SelectParameterModel } from "@/models/parameter/selectParameter";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { ScrollView, StyleSheet } from "react-native";
import DoubleParameter from "../parameter/DoubleParameter";
import NumericParameter from "../parameter/NumericParameter";
import SelectParameter from "../parameter/SelectParameter";
import EffectSelector from "./EffectSelector";
import EffectState from "./EffectState";

function EffectEdit() {

    return (
        <VStack style={styles.mainContainer} className="bg-secondary-0">
            <HStack style={styles.selectionContainer} >
                <EffectState/>
                <EffectSelector/>
            </HStack>
            <ScrollView style={styles.parametersContainer}>
                { store.gp200.currentEffect && store.gp200.currentEffect.parameters.map(p => {
                    if (p.type === "Numeric") {
                        return <NumericParameter key={p.name + p.id} param={p as NumericParameterModel}/>
                    } else if (p.type === "Select" ) {
                        return <SelectParameter key={p.name} param={p as SelectParameterModel}/>
                    } else {
                        return <DoubleParameter key={p.name} param={p as DoubleParameterModel} />
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