import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import FormInput from "./FormInput";
import Colors from "../../Utils/Colors";
import SubmitButton from "./SubmitButton";

import { IP_SERVER } from "../../config/config";
import { setToken, getToken, setUserID, getUserID } from "../../Utils/SecureStore";

import {  useNavigation } from "expo-router";
import { Platform } from "react-native";

const LoginForm = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mdpOubliePop, setMdpPopVisible] = useState(false);
  const navigation=useNavigation();

  const VerifLog = (data) => {
    
    if (data.hasOwnProperty("error")){
      setMdpPopVisible(true);
      return;
      
    }

    if ('personne' in data){
      setToken(data.tokenType+data.accessToken);
      setUserID(data.personne.id.toString());
      //getUserID().then((userId) => console.log( " USER ID : " +userId));
      navigation.navigate('profil');
      //navigate 
      //getToken().then((token) => console.log("TOKEN : "+token));
       
    }

  }
  
  const login = () => {
    fetch(IP_SERVER + "user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization":getToken()
      },
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        VerifLog(data)
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données:", error);
      });
  };


  return (
    <KeyboardAvoidingView enabled 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.form]}

     >
      <FormInput
      
        onChangeText={setEmail}
        inputFieldTitle={"Email"}
        placeholder={"JeromeFessy@gmail.com"}
      ></FormInput>
      <FormInput
        onChangeText={setPassword}
        inputFieldTitle={"Mot de passe"}
        placeholder={"****************"}
        isSecureEntry={true}
      ></FormInput>
      
      <SubmitButton title={"connexion"} onPressFunction={login}></SubmitButton>
      <Text
        style={{ color:"#5db074",fontWeight:"bold",textAlign:"center",fontSize:18,marginTop:10 }}
        onPress={()=>{navigation.navigate("mdpOublie")}}
      >
        Mot de passe oublié 
      </Text>

      <Text style={ //Mdp Faux
        [styles.mdpFaux, mdpOubliePop ? styles.visible : styles.hidden]}>
        Votre mot de passe est  incorrect. Veuillez le vérifier.
      </Text>
        
        
    </KeyboardAvoidingView>
  );
};


const statusManager = (codeStatus) => {
  if (codeStatus >= 200 && codeStatus < 300) {
    console.log("tout va bien");
    return true;
  }
  if (codeStatus === 401) {
    console.log("identifiant incorrect");
  }
  return false;
};

const redirectMdpOublie=()=>{
  const useNavigation=useNavigation();
  useNavigation.navgate("medicament")
}
const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 50,
    paddingTop: 20,
    width: Dimensions.get("window").width,    
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  mdpFaux: {
    color: Colors.rouge,
    textAlign: 'center',
    margin: 20,
    fontSize: 15,

  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  mdpFaux: {
    color: Colors.rouge,
    textAlign: 'center',
    margin: 20,
    fontSize: 15,

  },
});

export default LoginForm;
