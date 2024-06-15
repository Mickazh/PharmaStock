import React, { useState, useEffect } from 'react';
import {StyleSheet,  View,  SafeAreaView,  Text,  TouchableOpacity, Alert, Modal, ActivityIndicator, Dimensions, ScrollView, } from 'react-native';
import Colors from "../Utils/Colors";
import { useNavigation, useFocusEffect } from 'expo-router'
import { getUserID, setToken, setUserID} from "../Utils/SecureStore";
import { IP_SERVER } from "../config/config"; //Remettre sur .env apres - il marche pas pour moi
import { PopUpMiddle } from '../components.js/others/PopUp';



const profil = () => {
  const [nom, SetNom] = useState("testNom");
  const [prenom, SetPrenom] = useState("testNom");
  const [email, SetEmail] = useState("testEmail");
  const navigation = useNavigation();
  const [ContactVisible, setContactVisible] = useState(false);
  const [ConditionsVisible, setConditionsVisible] = useState(false);
  const [isVisible, setisVisible] = useState(false)

  const deco = () =>{
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ? ', [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      {text: 'Déconnexion', onPress: () => {
        navigation.navigate("connexionEnregistrement");
        setUserID('');
        setToken('');
      }},
    ]);
  }

  useFocusEffect(
    React.useCallback(() => {
      setisVisible(false)
        getUserID().then((id) => {
          if (id != '' && id != undefined){
            setisVisible(true)
            getUser(id);
            return;
          }
          navigation.navigate('connexionEnregistrement');
        });  
    }, [])
  );


  const getUser = (id) => {
    fetch(IP_SERVER + "user/findById?idPersonne=" + parseInt(id) , {
      method: "GET",
      headers: {
      },
    })
      .then((response) => response.json())
      .then((data) => {
        SetNom(data.nom)
        SetEmail(data.email)
        SetPrenom(data.prenom)
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données:", error);
      });
  };




  return (
    <SafeAreaView style={[styles.container, {opacity: isVisible ? 1 : 0}]}> 
      <Text style={styles.titleText}>Mon Compte</Text>

      <View style={styles.SectioninfoCompte}> 
        <View style={styles.TextInfoCompte}>
          <Text style={styles.InfoCompte}>Nom : </Text>
          <Text style= {styles.InfoUtilisateur}>{nom}</Text>
        </View>
        
        <View style={styles.TextInfoCompte}>
          <Text style={styles.InfoCompte}>Prénom : </Text>
          <Text style= {styles.InfoUtilisateur}>{prenom}</Text>
        </View>

        <View style={styles.TextInfoCompte}>
          <Text style={styles.InfoCompte}>Email : </Text>
          <Text style= {styles.InfoUtilisateur}>{email}</Text>
        </View>
      </View>
      
      <View style={styles.SectionboutonsCompte}> 

        {/* <TouchableOpacity style={styles.buttonStyle}
        onPress={()=>{navigation.navigate("modifCompte")}}>
          <Text style={styles.buttonText}>Modifier mes informations</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.buttonStyle}
        onPress={() => setContactVisible(true)}
        >
          <Text style={styles.buttonText}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle}
        onPress={() => setConditionsVisible(true)}>
          <Text style={styles.buttonText}>Conditions d'utilisation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonStyle, {backgroundColor : Colors.rouge}]}
          onPress={deco}
        >
          <Text style={styles.buttonText }>Deconnexion</Text>
        </TouchableOpacity>

      </View>

      <PopUpMiddle 
      isVisible = {ContactVisible}
      setIsVisible={setContactVisible}
      contentView={
        <View>
          <Text style={styles.popUpTitre}>
            Contact
          </Text>
          <Text>
          Pour toute question ou préoccupation concernant l'application, veuillez nous contacter à xxx@xxx.com.
          </Text>
        </View>
      }
      >
      </PopUpMiddle>



      <PopUpMiddle 
      isVisible = {ConditionsVisible}
      setIsVisible={setConditionsVisible}
      contentView={ 
        <View>
          <Text style={styles.popUpTitre}>
            Condition d'utilisation
          </Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.text}>
            <Text style={styles.titreCondi}>1. Introduction</Text>
            {'\n'}
Bienvenue sur PharmaStock (ci-après "l'Application"). En utilisant cette application, vous acceptez les présentes Conditions d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'Application.
{'\n'}{'\n'}
<Text style={styles.titreCondi}>2. Objet de l'Application</Text>
{'\n'}
L'Application a pour but de fournir des informations et des outils pour la gestion des médicaments utilisés. Elle peut inclure des fonctionnalités telles que la recherche de médicaments, la gestion des ordonnances, des rappels de prise de médicaments, et des informations sur les interactions médicamenteuses.
{'\n'}{'\n'}
<Text style={styles.titreCondi}>3. Utilisation de l'Application</Text>{'\n'}
    Vous devez avoir au moins 18 ans ou utiliser l'Application sous la supervision d'un parent ou tuteur légal.
    Vous acceptez d'utiliser l'Application uniquement à des fins légales et conformément aux présentes Conditions d'Utilisation.
    Vous ne devez pas utiliser l'Application de manière à causer des dommages ou des interruptions dans son fonctionnement.
    {'\n'}{'\n'}
    <Text style={styles.titreCondi}>4. Collecte et Utilisation des Données</Text>{'\n'}


    Données Collectées : L'Application peut collecter des informations telles que vos médicaments, ordonnances, historique de prise de médicaments, et autres données pertinentes pour vous fournir ses services.
    Utilisation des Données : Les données collectées sont utilisées pour personnaliser votre expérience utilisateur, améliorer l'Application, et vous fournir des informations et des rappels pertinents.
    Confidentialité : Vos données sont traitées conformément à notre [Politique de Confidentialité](lien vers la politique de confidentialité). Nous nous engageons à protéger votre vie privée et à utiliser vos données de manière sécurisée.

    {'\n'}{'\n'}
<Text style={styles.titreCondi}>5. Droits et Responsabilités des Utilisateurs</Text>{'\n'}
    Vous êtes responsable de l'exactitude des informations que vous fournissez à l'Application.
    Vous ne devez pas partager votre compte ou vos identifiants de connexion avec d'autres personnes.
    Vous êtes responsable de la sécurité de votre appareil et de vos informations de connexion.

    {'\n'}{'\n'}
<Text style={styles.titreCondi}>6. Limitation de Responsabilité</Text>{'\n'}
    L'Application fournit des informations à titre informatif et ne remplace en aucun cas les conseils, diagnostics ou traitements médicaux fournis par des professionnels de santé qualifiés.
    Nous ne garantissons pas l'exactitude, la complétude ou l'actualité des informations fournies par l'Application.
    Nous ne sommes pas responsables des conséquences liées à l'utilisation de l'Application ou des informations qu'elle contient.

    {'\n'}{'\n'}
<Text style={styles.titreCondi}>7. Modifications des Conditions d'Utilisation</Text>{'\n'}
Nous nous réservons le droit de modifier les présentes Conditions d'Utilisation à tout moment. Les modifications seront publiées sur cette page et entreront en vigueur dès leur publication. Il est de votre responsabilité de consulter régulièrement cette page pour vous tenir informé des éventuelles modifications.
{'\n'}{'\n'}
<Text style={styles.titreCondi}>8. Résiliation</Text>{'\n'}
Nous nous réservons le droit de suspendre ou de résilier votre accès à l'Application à tout moment, sans préavis, en cas de non-respect des présentes Conditions d'Utilisation ou pour toute autre raison légitime.
{'\n'}{'\n'}
<Text style={styles.titreCondi}>9. Droit Applicable{'\n'}
</Text>
Les présentes Conditions d'Utilisation sont régies et interprétées conformément aux lois en vigueur en France.
            </Text>
          </ScrollView>
        </View>

      }>
      </PopUpMiddle>

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  popUpTitre: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.noir,
    textAlign: "center",
    padding: 5,
  },
  scrollView: {
    marginHorizontal: 10,
    maxHeight: 500,
  },
  titreCondi:{
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.noir,
    padding: 2,
  },
  text: {
    fontSize: 15,
    width: "100%",
    flexWrap: 'wrap',
  },


  contactContainer: {
    backgroundColor: Colors.gris,

  },
  conditionContainer: {
    opacity: 0.5,
    backgroundColor: Colors.gris,
  },

  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.noir,
    textAlign: "center",
    padding: 10,
    marginTop: 15
  },

  SectioninfoCompte:{
    justifyContent: 'center',
    flex: 2,
  },

  TextInfoCompte:{
    alignContent: "center",
    flexDirection: 'row',
    marginHorizontal: 30,
    marginVertical: 10,
    
  },

  InfoCompte:{
    color: Colors.gris,
    fontSize: 20,
    fontWeight: 'bold',
  },

  InfoUtilisateur:{
    fontSize: 20,
  },

  SectionboutonsCompte:{
    alignContent: "center",
    flex: 4,
  },

  buttonStyle:{
    backgroundColor: Colors.vertFonce,
    alignItems: 'center',
    borderRadius: 45,
    margin: 15,
    padding: 7,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.blanc,
    padding: '2%',
  }
})


export default profil;
