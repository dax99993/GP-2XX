import { Image, View } from "react-native";



function EffectUnit() {
    return (
        <>
        <View>
            <Image 
                source={{
                    uri:'https://reactnative.dev/docs/assets/p_cat2.png'
                }}
                style= {{
                    width: 50, height: 100,
                    marginHorizontal: 10,
                    marginVertical: 30,
                }}
                />
        </View>
        </>
    )
}



export default EffectUnit;