import ButtonWithIcon from "@/components/ButtonIcon";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { EffectType } from "@/models/effect/effect";
import { DoubleParameterModel } from "@/models/parameter/doubleParameter";
import { NumericParameterModel } from "@/models/parameter/numericParameter";
import { SelectParameterModel } from "@/models/parameter/selectParameter";
import { store } from "@/models/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { ScrollView, StyleSheet } from "react-native";
import DoubleParameter from "../parameter/DoubleParameter";
import NumericParameter from "../parameter/NumericParameter";
import SelectParameter from "../parameter/SelectParameter";

function EffectEdit() {
    const router = useRouter();

    const goToSelectEffect = () => {
        router.push("/ui/edit/select_effect");
    };

    return (
        <VStack style={styles.mainContainer}>
            <HStack style={styles.selectionContainer}>
                <Center className="bg-secondary-300 mx-3 my-2 px-2 py-2 rounded-md">
                        <Text bold={true}>{EffectType[store.gp200.current_effect.type]}</Text>
                        <Switch
                            size="md"
                            value={store.gp200.current_effect.state}
                            onValueChange={(v) => {
                                console.log(v);
                                store.gp200.changeEffectState(v);
                            }}
                        />
                </Center>
                <ButtonWithIcon title={store.gp200.current_effect.name}
                    onPress={goToSelectEffect}
                    icon={<Ionicons name="caret-forward" color={"white"} size={16}/>}
                />
            </HStack>
            <ScrollView style={styles.parametersContainer}>
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