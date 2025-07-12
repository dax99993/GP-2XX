import { gp200 } from "@/models/gp200";
import { observer } from "mobx-react-lite";
import { StyleSheet, Switch, Text, View } from "react-native";
import Parameter from "./Parameter";


function EffectEdit() {
    return (
        <>
        <View style={styles.mainContainer}>
            <View style={styles.selectionContainer}>
                <View style={styles.stateContainer}>
                    <Text>State</Text>
                    <Switch
                        onValueChange={(v) => {
                            console.log(v);
                            gp200.current_preset.pre.toggleState();
                            gp200.changeEffectState();
                        }}
                        value={gp200.current_preset.pre.state}
                    />
                </View>
                <Text>List of Effects</Text>
            </View>
            <View style={styles.parametersContainer}>
                <Text>Parameters</Text>
                { gp200.current_preset.pre.parameters.map(p => (
                    <Parameter key={p.name} name={p.name} initial_value={p.getValue()}/>
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