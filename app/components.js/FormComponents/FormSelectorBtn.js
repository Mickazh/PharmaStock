import React from "react";
import { View, StyleSheet,Text,TouchableWithoutFeedback,Animated } from "react-native";
import Colors from "../../Utils/Colors";


const FormSelectoBtn = ({ title,backgroundColor,border,onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={[styles.container,{backgroundColor},border]}>
        <Text style={styles.textStyle}>{title}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle:{
     color: Colors.blanc, 
     fontSize: 16,    
     fontWeight: "bold",
  }
});

export default FormSelectoBtn;
