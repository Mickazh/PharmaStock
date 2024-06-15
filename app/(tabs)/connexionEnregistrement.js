import { View, StyleSheet, Dimensions, Animated, Image } from "react-native";
import React, { useRef, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import LoginRegisterFormHeader from "../components.js/FormComponents/LoginRegisterFormHeader";
import FormSelectoBtn from "../components.js/FormComponents/FormSelectorBtn";
import { ScrollView } from "react-native";
import LoginForm from "../components.js/FormComponents/LoginForm";
import RegisterForm from "../components.js/FormComponents/RegisterForm";
import Colors from "../Utils/Colors";
import logo from"../../assets/logo.png"; 

const windowWidth = Dimensions.get("window").width;


const Test = () => {
  const animation = useRef(new Animated.Value(0)).current;
  const pageTranslateY = useRef(new Animated.Value(-100)).current;
  const pageOpacity = useRef(new Animated.Value(0)).current;
  const scrollView = useRef();


  const translateY1 = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [50, 130],
  });
  const translateY2 = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [-130, 0],
  });
  const opac1 = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [1, 0],
  });
  const opac2 = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [0, 1],
  });

  const colorLoginSelector = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [Colors.vertFonce, Colors.vertClair],
  });
  
  const colorRegisterSelector = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [Colors.vertClair, Colors.vertFonce],
  });


  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: animation } } }],
    { useNativeDriver: false }
  );

  useFocusEffect(
    React.useCallback(() => {
      pageTranslateY.setValue(-100); 
      pageOpacity.setValue(0); 
      Animated.parallel([
        Animated.timing(pageTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pageOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    }, [])
  );

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: pageTranslateY }], opacity: pageOpacity }]}>
      <Image source={logo} style={styles.logo} />
      <View>
        <LoginRegisterFormHeader
          translateY1={translateY1}
          translateY2={translateY2}
          opac1={opac1}
          opac2={opac2}
          title1={"Connexion"}
          title2={"Inscription"}
          subHeading={"Votre Pillule Notre Devoir"}
        ></LoginRegisterFormHeader>
      </View>
      <View style={{ flexDirection: "row", padding: 10 }}>
        <FormSelectoBtn
          onPress={() => { scrollView.current.scrollTo({ x: 0 }) }}
         
          border={styles.borderLeft}
          backgroundColor={colorLoginSelector}
          title={"Connexion"}
        ></FormSelectoBtn>
        <FormSelectoBtn
          onPress={() => { scrollView.current.scrollTo({ x: windowWidth }) }}
          
          border={styles.borderRight}
          backgroundColor={colorRegisterSelector}
          title={"S'enregistrer"}
        ></FormSelectoBtn>
      </View>
      <ScrollView
        ref={scrollView}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView style={styles.formContainer}>
          <LoginForm />
        </ScrollView>

        <ScrollView style={styles.formContainer}>
          <RegisterForm />
        </ScrollView>
        
      </ScrollView>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-10vh",
  },
  logo: {
    marginBottom:-20,
    width: 100, 
    height: 100, 
    marginTop:70,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.noir,
  },
  borderLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  borderRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
    width: Dimensions.get("window").width,
  },
  formContainer: {
  },
  connexionAppear: {
    color: "red",
  },
});

export default Test;
