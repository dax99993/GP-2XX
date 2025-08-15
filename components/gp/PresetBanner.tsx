import { Text } from "@/components/ui/text";
import { observer } from "mobx-react-lite";
import { StyleSheet, View } from "react-native";
import { HStack } from "../ui/hstack";


type PresetBannerProps = {
  presetName: string;
  presetBankCode: string;
}

function PresetBanner(props: PresetBannerProps) {
  
    return (
        <HStack style={styles.bannerContainer}>
            <View style={styles.presetCodeContainer}>
              <Text style={styles.text}>{props.presetBankCode}</Text>
            </View>
            <Text style={styles.presetSeparator}></Text>
            <View style={styles.presetNameContainer}>
              <Text style={styles.text}>{props.presetName}</Text>
            </View>
        </HStack>
    )
}


const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#007FFF', //azure
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  presetCodeContainer: {
    paddingHorizontal: 15,
    backgroundColor: 'lightgray', 
    //marginBlockEnd: 10,
    //marginLeft: 10,
  },
  presetSeparator: {
    backgroundColor: 'black', 
  },
  presetNameContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 20,
    marginRight: 10,
    backgroundColor: 'gray'
  },
});

export default observer(PresetBanner);