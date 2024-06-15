import React from "react";
import { View, StyleSheet,Text,Animated } from "react-native";
import Colors from "../../Utils/Colors";

const LoginRegisterFormHeader = ({ title1, title2, subHeading, translateY1 = 0, translateY2 = 0, opac1 = 1, opac2 = 0.5}) => {
  return (
    <>
      <View style={styles.container}>
        <Animated.Text style={[styles.titleText, { transform: [{ translateY: translateY1 }], opacity: opac1 }]}>
          {title1}
        </Animated.Text>

        <Animated.Text style={[styles.titleText, { transform: [{ translateY: translateY2 }], opacity: opac2 }]}> 
          {title2}
        </Animated.Text>
        
      </View>
      <Text style={styles.subText}>{subHeading}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#4a8c5c",
  },
  subText:{
    fontSize: 18,
    textAlign: "center",
    color: "#5db074",
    fontWeight:"bold"
  }

});

export default LoginRegisterFormHeader;
