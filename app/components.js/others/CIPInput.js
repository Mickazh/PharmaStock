import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import Colors from "../../Utils/Colors";
import Scanner from '../views/Scanner';

const CIPInput = ({ onChangeText, value }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState("");

  const handleScan = ({ data }) => {
    setScannedData(data); // Stocke la valeur scannée dans l'état local
    onChangeText(data); // Appelle la fonction de rappel avec la valeur scannée
    setModalVisible(false);
  };

  const handleChangeText = (text) => {
    setScannedData(text);
    onChangeText(text); // Si vous avez besoin de mettre à jour la valeur saisie manuellement
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Code CIP à 13 chiffres"
        placeholderTextColor={Colors.grisClair}
        value={value}
        onChangeText={handleChangeText} // Utilisez handleChangeText pour mettre à jour la valeur saisie manuellement
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
        <FontAwesome name="camera" size={20} color={Colors.vertFonce} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Scanner onClose={() => setModalVisible(false)} onScan={handleScan} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.blanc,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.noir,
    paddingVertical: 6,
  },
  btn: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: Colors.blanc,
    borderColor: Colors.vertFonce,
    borderWidth: 0.5,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CIPInput;
