import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import FormInput from "../components.js/FormComponents/FormInput";
import SubmitButton from "../components.js/FormComponents/SubmitButton";
import { IP_SERVER } from "../config/config";
import { useNavigation, useSegments } from "expo-router";
import logo from "../../assets/logo.png"; 

const mdpOublie = () => {
  const [email, setEmail] = useState("");
  const [code6, setCode6] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confirmedNewPassword, setConfirmedNewPassword] = useState("");
  const [tokenOriginale, setTokenOriginale] = useState("");
  const [tokenRecu, setTokenRecu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendResetCode = () => {
    setIsLoading(true);
    fetch(IP_SERVER + "admin/reset-password-get-token?email=" + email, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTokenOriginale(data.message);
        console.log("Code pour reset envoyé à " + email);
        setTokenRecu(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données:", error);
        setIsLoading(false);
      });
  };

  const resetPassword = () => {
    if (newPassword !== confirmedNewPassword) {
      console.log("Les mots de passe ne correspondent pas");
      return;
    }

    fetch(IP_SERVER + "admin/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        newPassword: newPassword,
        tokenOriginale: tokenOriginale,
        code6: code6,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse du serveur:", data);

      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données:", error);
      });
  };

  const [slideOutAnim1, setSlideOutAnim1] = useState(new Animated.Value(0));
  const [slideOutAnim2, setSlideOutAnim2] = useState(new Animated.Value(Dimensions.get("window").height));

  const slideOut = () => {
    Animated.timing(slideOutAnim1, {
      toValue: -Dimensions.get("window").width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      sendResetCode();
      slideIn();
    });
  };

  const slideIn = () => {
    Animated.timing(slideOutAnim2, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle1 = {
    transform: [{ translateX: slideOutAnim1 }],
  };

  const animatedStyle2 = {
    transform: [{ translateY: slideOutAnim2 }],
  };

  useEffect(() => {
    if (tokenOriginale !== "") {
      setTokenRecu(true);
      console.log("token useEffect: " + tokenOriginale);
    }
  }, [tokenOriginale]);

  const navigation = useNavigation();
  const segments = useSegments();
  useEffect(() => {
    setSlideOutAnim1(new Animated.Value(0));
    setSlideOutAnim2(new Animated.Value(Dimensions.get("window").height));
  }, [segments]);

  return (
    <View style={styles.container}>
      {!tokenRecu && (
        <Animated.View style={[styles.inputContainer, animatedStyle1]}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.label}>
            Saisir votre email avec lequel vous vous connectez
          </Text>
          <FormInput
            placeholder={"Saisir votre email"}
            onChangeText={setEmail}
            style={styles.input}
          />
          <SubmitButton
            title={"Recevoir le code"}
             onPressFunction={() => {
              slideOut();
            }}
            style={styles.button}
          ></SubmitButton>
        </Animated.View>
      )}

          <Animated.View style={[styles.inputContainer2, animatedStyle2]}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.label}>
            Saisir le code à 6 chiffres envoyé à {email}
          </Text>
          <FormInput
            placeholder={"Code à 6 chiffres"}
            onChangeText={setCode6}
            style={styles.input}
          />
          <FormInput
            placeholder={"Nouveau mot de passe"}
            isSecureEntry={true}
            onChangeText={setnewPassword}
            style={styles.input}
          />
          <FormInput
            placeholder={"Confirmer le nouveau mot de passe"}
            isSecureEntry={true}
            onChangeText={setConfirmedNewPassword}
            style={styles.input}
          />
          <SubmitButton
            title={"Mettre à jour"}
            onPressFunction={resetPassword}
            style={styles.button}
          />
        </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    width: Dimensions.get("window").width,
    backgroundColor: "#5DB075",
    alignItems: "center", 
  },
  logo: {
    width: 100, 
    height: 100,
    marginBottom: 20,
    alignSelf: 'center', 
  },
  inputContainer: {
    marginTop:40,
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20, 
    elevation: 10, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    width: '100%',

  },
  inputContainer2:{
   marginBottom: 20,
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20, 
    elevation: 10, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    width: '100%',
    marginTop: 100,
  },
  label: {
    fontSize: 16,
    color: "#5DB075",
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: 'center', 
  },
  input: {
   
  },
  button: {
    marginTop: 10,
  },
});

export default mdpOublie;
