import { EffectType } from "@/models/effect/effect";
import { store } from "@/models/store";
import { observer } from "mobx-react-lite";
import { StyleSheet, Switch, Text, View } from "react-native";
import ParameterBox from "../parameter/Parameter";


function EffectEdit() {
    return (
        <>
        <View style={styles.mainContainer}>
            <View style={styles.selectionContainer}>
                <View style={styles.stateContainer}>
                    <Text>{`State ${EffectType[store.gp200.current_effect.type]}`}</Text>
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
            <View style={styles.parametersContainer}>
                <Text>Parameters</Text>
                { store.gp200.current_effect.parameters.map(p => (
                    <ParameterBox key={p.name} param={p}/>
                )) 
                }
            </View>
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
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'lightgreen',
    },
    stateContainer: {
        //flex:1,
        flexDirection: 'column',
        backgroundColor: 'red',
    },
    parametersContainer: {
        flex:5,
        flexDirection: 'column',
        backgroundColor: 'lightblue',
    }

});


export default observer(EffectEdit);