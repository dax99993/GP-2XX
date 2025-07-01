import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";


type PresetBannerProps = {
  presetName: string;
  presetNumber: number;
}

function presetNumberToCode(number: number) : string {
  const bankNumber = Math.floor(number / 4) + 1;
  let bankLetter: string = "";
  switch (number % 4) {
    case 0:
      bankLetter = 'A';
      break;
    case 1:
      bankLetter = 'B';
      break;
    case 2:
      bankLetter = 'C';
      break;
    case 3:
      bankLetter = 'D';
      break;
  }

  return bankNumber + '-' + bankLetter;
}

function PresetBanner(props: PresetBannerProps) {

  
    return (
        <>
        <View style={styles.bannerContainer}>
            <View style={styles.presetCodeContainer}>
              <Text style={styles.text}>{presetNumberToCode(props.presetNumber)}</Text>
            </View>
            <Text style={styles.presetSeparator}></Text>
            <View style={styles.presetNameContainer}>
              <Text style={styles.text}>{props.presetName}</Text>
            </View>
        </View>
        </>
    )
}


const styles = StyleSheet.create({
  bannerContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#007FFF', //azure
    borderRadius: 5,
    borderCurve: 'continuous',
    //minHeight: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  presetCodeContainer: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: 'lightgray', 
    //marginBlockEnd: 10,
    //marginLeft: 10,
  },
  presetSeparator: {
    //flex: 1,
    //paddingHorizontal: 20,
    backgroundColor: 'black', 
    minHeight: '80%',
    //maxWidth: 5,
    //fontSize: 1,
  },
  presetNameContainer: {
    flex: 3,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 20,
    marginRight: 10,
    backgroundColor: 'gray'
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white', 
    textAlign: 'center',
  },
});

export default observer(PresetBanner);