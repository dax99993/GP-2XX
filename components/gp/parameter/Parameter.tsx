import { IParameter } from '@/models/parameter/parameter';
import { observer } from 'mobx-react-lite';
import { createContext, useContext } from 'react';
import { StyleSheet, View } from "react-native";
import NumericParameter from './NumericParameter';
import SelectParameter from './SelectParameter';



type ParameterProps = {
    param: IParameter;
}


function ParameterBox(props: ParameterProps) {
    console.log(props.param.name, props.param.type);

    // return  (
    //     <View style={styles.container}>
    //         {props.param.type === "Numeric" && <NumericParameter param={props.param} />}
    //     </View>
    // );

        return  (
            <ParameterContext.Provider value={props.param}>
                <View style={styles.container}>
                    {props.param.type === "Numeric" && <NumericParameter />}
                    {props.param.type === "Select" && <SelectParameter />}
                </View>
            </ParameterContext.Provider>
    );

    //return (<></>);
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'orange',
    }
});

export function useParameter() {
    const param = useContext(ParameterContext);

    if (!param) {
        throw new Error("useParameter used in wrong place");
    }

    return param;
}


export const ParameterContext = createContext<IParameter | null>(null);
export default observer(ParameterBox);