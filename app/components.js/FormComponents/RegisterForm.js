import React,{useState} from "react";
import { View, StyleSheet,Text,Dimensions } from "react-native";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
//import { IP_SERVER } from "@env";
import { IP_SERVER } from "../../config/config";
import { setToken, setUserID } from "../../Utils/SecureStore";
import {  useNavigation } from "expo-router";
import {PopUpMiddle} from "../others/PopUp";

//faire la verification que les inputBox ne sont pas vide
const RegisterForm = () => {
    const [nom,setNom] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [prenom,setPrenom] = useState("");  
    const navigation=useNavigation();
    
    const VerifRegister = (data) => {
      if (data.message.includes("enregistré")){
        //setToken(data.tokenType+data.accessToken);
        //setUserID(data.personne.id.toString());
        navigation.navigate('profil');
        console.log("enregistre");
        //Connexion automatique au compte -> setToken / setUserID
        
      }
      else{
        if(data.message.includes("email existe deja")){
          console.log("existe");
          showPopup("L'email saisi existe déjà")
          //Afficher un message d'erreur à l'utilisateur pour lui dire que l'email existe déjà
        }
      }
    }    
    const [isVisible, setIsVisible] = useState(false);
    const [contentView, setPopupText] = useState("Erreur lors de la saisie"); // État pour le texte de la popup

    const showPopup = (message) => {
      setPopupText(message);
      setIsVisible(true);
    };

    const register=() => {
      console.log(nom,prenom,email,password);
      if (nom==""||prenom==""||email==""||password==""){
        showPopup("Un des champs n'est pas renseigné")
      }
      else if(password.length<8||!/\d/.test(password)){
        showPopup("Le mot de passe doit contenir 8 caractères dont au moins 1 chiffre")
      }
      else if(!validateEmail(email)){
        showPopup("L'email saisi est invalide")
      }

      else{
        fetch(IP_SERVER+'user/register', {
          method: 'POST',    
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: nom,
            prenom: prenom,
            password: password,
            email: email
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log('Réponse du serveur:', data);
          VerifRegister(data);
        })
        .catch(error => {
          console.error('Erreur lors de l\'envoi des données:', error);
        });
        console.log("ici");
      }
    }
    return (
      <View style={styles.form}>
          <FormInput onChangeText={setEmail} inputFieldTitle={"Email"}placeholder={"JeromeFessy@gmail.com"} ></FormInput>
          <FormInput onChangeText={setNom} inputFieldTitle={"Nom"}placeholder={"Nom"} ></FormInput>
          <FormInput onChangeText={setPrenom} inputFieldTitle={"Prenom"}placeholder={"Prenom"} ></FormInput>
          <FormInput onChangeText={setPassword} inputFieldTitle={"Mot de passe"}placeholder={"Eviter '1234azerty' par pitié"} isSecureEntry={true} ></FormInput>
          <PopUpMiddle isVisible={isVisible} setIsVisible={setIsVisible} contentView={
            <Text style={styles.popupText}>{contentView}</Text>
          } />
          <SubmitButton title={"M'inscrire"} onPressFunction={register}></SubmitButton>
      </View>
    );
  };
  function validateEmail(email) {
    // Expression régulière pour valider l'email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}
  
  const styles = StyleSheet.create({
    form: {
      paddingHorizontal: 50,
      paddingTop: 20,
      width: Dimensions.get("window").width,
    },
    popupText: {
      fontSize: 18, 
      textAlign: 'center',
      color: '#333', 
      fontWeight: '500', 
    },

  
  });


  export default RegisterForm;