import { View, Text, StyleSheet, TextInput, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, Entypo, EvilIcons } from '@expo/vector-icons';
import { IP_SERVER } from "../../config/config";

import Colors from "../../Utils/Colors";

const ConsulterSignalementView = ({ idPharmacie, toggleSignalementView }) => {

  const [searchText, setSearchText] = useState('');
  const [medicaments, setMedicaments] = useState([]);

  const getSignalement = () => {
    fetch(IP_SERVER + "signalement/getSignalementLastWeek?idPharmacie=" + idPharmacie, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMedicaments(data);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données:", error);
      });
  }

  useEffect(() => {
    if (idPharmacie !== undefined) {
      getSignalement();
    }
  }, [idPharmacie]);

  const filteredMedicaments = medicaments.filter(medoc =>
    medoc.nomMedicament.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.customBtn} onPress={toggleSignalementView}>
        <Text style={styles.btnText}>{"faire un signalement"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Signalement récents</Text>
      <View style={styles.inputContainer}>
        <EvilIcons name="search" size={24} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Rechercher un médicament"
          onChangeText={setSearchText}
          value={searchText}
        />
      </View>
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ flexGrow: 1 }}>
        {filteredMedicaments.map((medoc, index) => (
          <View style={styles.card} key={index}>
            <Text style={[styles.heading, styles.text]}>
              <AntDesign size={18} name="disconnect" color="black" />{" "}
              {medoc.nomMedicament}
            </Text>
            <Text style={styles.text}>
              <Entypo name="warning" size={18} color="black" />{" "}
              Nombre signalement : {medoc.nbSignalement}
            </Text>
            <View>
              <Text style={styles.text}>
                <AntDesign name="calendar" size={18} color="black" />{" "}
                Dernier signalement : 
              </Text>
              <DateDisplay date={new Date(medoc.lastDateSignalement)} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

function DateDisplay({ date }) {
  return (
    <Text>
      {jours[date.getDay()]} {date.getDate()} {mois[date.getMonth() - 1]}{" "}
      {date.getFullYear()} {date.getHours()}h{date.getMinutes()}
    </Text>
  );
}

const jours = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const mois = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Novembre",
  "Decembre",
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginBottom: "25%",
  },
  text: {
    fontWeight: "900",
    color: Colors.vertFonce,
  },
  heading: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 13,
  },
  card: {
    margin: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.blanc,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: Colors.noir,
    padding: 5,
    margin: 8,
  },
  input: {
    marginLeft: 10,
    flex: 1,
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
});

export default ConsulterSignalementView;
