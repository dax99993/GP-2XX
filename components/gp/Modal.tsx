import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";


export default function ConnectionModal() {
    const [modalVisible, setModalVisible] = useState(true);

    const send_message = () => {
    };

    return (
    <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
        <View style={styles.mainContainer}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalText} onPress={(e)=>{send_message(); setModalVisible(false)}}>
                    Connect device.
                </Text>
            </View>
        </View>
    </Modal>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255 , 255, 0.5)',
        //opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 24,
        textAlign: 'center',
    }
});