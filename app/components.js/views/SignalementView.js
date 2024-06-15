import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert, Animated, Image } from 'react-native';
import { FontAwesome5, Foundation, Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import IconTextWrapper from '../others/IconTextWrapper';
import CIPInput from '../others/CIPInput';
import Colors from '../../Utils/Colors';
import { IP_SERVER } from "../../config/config";
import SubmitButton from '../FormComponents/SubmitButton';
import ConsulterSignalementView from './ConsultationSignalementsView';
import { getToken, getUserID } from '../../Utils/SecureStore';
import { useNavigation } from 'expo-router'
import { PopUpMiddle } from '../others/PopUp';

const SignalementView = ({ pharmacie }) => {
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const [showSignalement, setShowSignalement] = useState(false);
  const [cip13, setCip13] = useState('');
  const [isVisiblePopUp, setIsVisiblePopUp] = useState(false);
  const [message, setMessage] = useState("");

  const acceptCarteVitale = () => (pharmacie.accepteCarteVitale === "oui" ? "Accepte la carte vitale" : "N'accepte pas la carte vitale");
  const getPhoneNumber = () => (pharmacie.telPharmacie === "" ? "Indisponible :/" : pharmacie.telPharmacie);
  const getAdresse = () => `${pharmacie.adressePharmacieSimple}\n${pharmacie.codePostale} ${pharmacie.departement} ${pharmacie.region}`;
  const getIdPharmacie=()=>{return pharmacie.id}
  const toggleSignalementView = () => {
    setShowSignalement(!showSignalement);
    if (!showSignalement) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    } else {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const signaler = (idUser) => {
    if (cip13 === '') {
      Alert.alert('Erreur', 'Veuillez entrer un code CIP à 13 chiffres.');
      return;
    }
    fetch(`${IP_SERVER}signalement/signaler`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idUser:idUser,
        cip13: cip13, 
        idPharmacie: pharmacie.id,
      }),
    })
      .then((response) => {
        // if (!response.ok()) {
        //   throw new Error('Network response was not ok');
        // }
        return response.json();
      })
      .then((data) => {
        setMessage(data["msg"])
        // if (data.success) {
        //   Alert.alert('Succès', 'Le signalement a été envoyé avec succès.');
        // } else {
        //   Alert.alert('Erreur', 'Échec de l\'envoi du signalement. Veuillez réessayer.');
        // }
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données:", error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi du signalement. Veuillez réessayer.');
      });
  };

  const handleScrollY=(y)=>{
    if(y===0){
      setShowSignalement(false);
    }
  }
  getIdPharmacie()
  return (
    <ScrollView ref={scrollViewRef} pagingEnabled scrollEnabled={false} style={styles.scrollView} onScroll={Animated.event([],{useNativeDriver:false,listener:(event)=>{handleScrollY(event.nativeEvent.contentOffset.y)}})}>
      
      <View style={styles.titre}>
        <Text style={[styles.text, {fontWeight: 'bold', fontSize: 30, top: "6%"}]}>
          Signaler !
        </Text>
        <Image source={require("../../../assets/logo.png")} style={styles.image}/>
      </View>
      
      <View style={styles.contentContainer}>
        <IconTextWrapper style={styles.wrapper} icon={<FontAwesome5 name="hospital-alt" size={30} color={Colors.vertFonce} />} text={<Text style={styles.text}>{pharmacie.nomPharmacie}</Text>} />
        <IconTextWrapper style={styles.wrapper} icon={<Foundation name="marker" size={40} color={Colors.vertFonce} />} text={<Text style={styles.text}>{getAdresse()}</Text>} />
        <IconTextWrapper style={styles.wrapper} icon={<Foundation name="telephone" size={40} color={Colors.vertFonce} />} text={<Text style={styles.text}>{getPhoneNumber()}</Text>} />
        <IconTextWrapper style={styles.wrapper} icon={<Entypo name="v-card" size={30} color={Colors.vertFonce} />} text={<Text style={styles.text}>{acceptCarteVitale()}</Text>} />
        <IconTextWrapper style={[styles.wrapper, styles.cipWrapper]} icon={<MaterialCommunityIcons name="data-matrix" size={30} color={Colors.vertFonce} />} text={<CIPInput onChangeText={(cip)=>{ setCip13(cip)}} value={cip13} />} />
        <SubmitButton style={styles.submitButton} title="Signaler" onPressFunction={()=>{
          getUserID().then((idUser)=>{
            if (idUser != '' && idUser != undefined){
              signaler(idUser);
              setIsVisiblePopUp(true);
              return;
            }

            Alert.alert('Connexion', 'Vous devez être connecté pour effectuer un signalement ', [
              {
                text: 'Annuler',
                style: 'cancel',
              },
              {text: 'Connexion', onPress: () => {
                navigation.navigate("connexionEnregistrement");
              }},
            ]);           
          
          })
          }} />
        
        <TouchableOpacity style={[styles.customBtn,{position:"absolute",bottom:"0%",width:Dimensions.get("window").width,borderTopLeftRadius:10,borderTopRightRadius:10,borderBottomLeftRadius:0,borderBottomRightRadius:0}]} onPress={toggleSignalementView}>
          <Entypo name={ "chevron-up" } size={20} color={Colors.blanc} />
          <Text style={styles.btnText}>{"Voir les signalements"}</Text>
          <Entypo name={ "chevron-up" } size={20} color={Colors.blanc} />
        </TouchableOpacity>
      </View>

      {showSignalement && (
        <View style={styles.consulterSignalementView}>
        
         <ScrollView style={{ width: "100%" }} contentContainerStyle={{ flexGrow: 1 }}>
            <ConsulterSignalementView idPharmacie={pharmacie.id} toggleSignalementView={toggleSignalementView}/>
          </ScrollView>
        </View>
      )}
      <PopUpMiddle isVisible={isVisiblePopUp} setIsVisible={setIsVisiblePopUp} contentView={<View><Text>{message}</Text></View>}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height*0.9,
  },
  consulterSignalementView: {
    height: Dimensions.get("window").height,
    width: "100%",
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  customBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.vertFonce,
    borderRadius: 10,
    padding: 10,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  btnText: {
    color: Colors.blanc,
    fontSize: 16,
    marginHorizontal: 5,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.blanc,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "100%",
  },
  text: {
    fontSize: 16,
    color: Colors.vertFonce,
    marginLeft: 10,
  },
  cipWrapper: {
    marginTop: 10,
    width: "100%",
  },
  submitButton: {
    marginTop: 15,
    width: "100%",
    backgroundColor: Colors.vertFonce,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  titre : {
    flexDirection: 'row',
    top: "4%",
    left:"5%",
    position: 'absolute',
  },
  image: {
    left: "200%",
    right: 0,
    width: 75,
    height: 75,

  }
});

export default SignalementView;