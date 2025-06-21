import { StyleSheet, Text, View } from "react-native";



function PresetBanner() {
    return (
        <>
        <View style={styles.bannerContainer}>
            <Text style={styles.presetCodeContainer}>##-D</Text>
            <View style={styles.presetSeparator}></View>
            <Text style={styles.presetNameContainer}>Preset name</Text>
        </View>
        </>
    )
}


const styles = StyleSheet.create({
  bannerContainer: {
    //flex: 1,
    flexDirection: 'row',
    backgroundColor: '#007FFF', //azure
    borderRadius: 5,
    borderCurve: 'continuous',
    minHeight: 60,
    //alignContent: 'center',
    //justifyContent: 'center',
    alignItems: 'center',
  },
  presetCodeContainer: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white', 
    //backgroundColor: 'black'
  },
  presetSeparator: {
    //flex: 1,
    //paddingHorizontal: 20,
    backgroundColor: 'black', 
    //maxHeight: '80%',
    //maxWidth: 15,
  },
  presetNameContainer: {
    flex: 3,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white', 

  },
});

export default PresetBanner;