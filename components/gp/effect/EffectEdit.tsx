import { EffectType } from "@/models/effect/effect";
import { DoubleParameterModel } from "@/models/parameter/doubleParameter";
import { NumericParameterModel } from "@/models/parameter/numericParameter";
import { SelectParameterModel } from "@/models/parameter/selectParameter";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import DoubleParameter from "../parameter/DoubleParameter";
import NumericParameter from "../parameter/NumericParameter";
import SelectParameter from "../parameter/SelectParameter";


function EffectEdit() {
    return (
        <>
        <View style={styles.mainContainer}>
            <View style={styles.selectionContainer}>
                <View style={styles.stateContainer}>
                    <Text>{`${EffectType[store.gp200.current_effect.type]}`}</Text>
                    <Switch
                        onValueChange={(v) => {
                            console.log(v);
                            store.gp200.changeEffectState(v);
                        }}
                        value={store.gp200.current_effect.state}
                    />
                </View>
                <Text>List of Effects</Text>
            </View>
            <ScrollView style={styles.parametersContainer}>
                <Text>Parameters</Text>
                { store.gp200.current_effect.parameters.map(p => {
                    if (p.type === "Numeric") {
                        return <NumericParameter key={p.name} param={p as NumericParameterModel}/>
                    } else if (p.type === "Select" ) {
                        return <SelectParameter key={p.name} param={p as SelectParameterModel}/>
                    } else {
                        return <DoubleParameter key={p.name} param={p as DoubleParameterModel} />
                    }
                }) 
                }
            </ScrollView>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'pink'
    },
    selectionContainer: {
        //flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'lightgreen',
    },
    stateContainer: {
        //flex:1,
        flexDirection: 'column',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    parametersContainer: {
        //flex:5,
        flexDirection: 'column',
        backgroundColor: 'lightblue',
    }

});


export default observer(EffectEdit);