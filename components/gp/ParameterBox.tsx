import { StyleSheet, Text, View } from "react-native";

// TODO
// In first view can have an icon and the setter potentiometer

function ParameterBox() {
    return(
        <>
        <View style={styles.boxContainer}>
            <View>
                <Text>POT</Text>
            </View>
            <View style={styles.parameterDetailsContainer}>
                <Text style={styles.parameterNameContainer}>Param Name</Text>
                <Text style={styles.parameterValueContainer}>Value</Text>
            </View>
        </View>
        </>
    )

}
const styles = StyleSheet.create({
  boxContainer: {
    backgroundColor: '#6D8196',  // slate gray
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  parameterDetailsContainer: {
    flexDirection: 'column',
    maxWidth: 50,
  },
  parameterNameContainer: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  parameterValueContainer: {
    backgroundColor: '#353E43', //Gunmetal
    color: 'white',
    textAlign: 'center',
  }
});
export default ParameterBox;