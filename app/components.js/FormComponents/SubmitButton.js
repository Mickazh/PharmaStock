import React from "react";
import { View, StyleSheet, Text, TouchableOpacity,Dimensions } from "react-native";
import Colors from "../../Utils/Colors";

const SubmitButton = ({ title, left, right, onPressFunction }) => {
  return (
    <TouchableOpacity style={[styles.container]} onPress={onPressFunction}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: Colors.vertFonce,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    width: Dimensions.get('window').width/2.5,
    alignSelf: 'center', 
  },
  text: {
    color: Colors.blanc,
    fontSize: 20,
  },
});

export default SubmitButton;
