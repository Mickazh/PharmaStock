import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import Colors from "../Utils/Colors";

const MedicamentView = ({ medicament }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollViewContainer}>
        <Text style={styles.denomination}>
          {medicament["denomination"]}
        </Text>
        <Titre text={"Informations générales"}/>
        
        <View style={styles.infoGen}>
          <LigneView titre={"CIP13"} value={medicament["cip13"]}/>
          <LigneView titre={"CIS"} value={medicament["cis"]}/>
          <LigneView titre={"Titulaire"} value={medicament["titulaire"]}/>
          <LigneView titre={"Forme pharmaceutique"} value={medicament["formePharmaceutique"]}/>
          <LigneView titre={"Voies d'administration"} value={medicament["voiesAdministration"]}/>
        </View>

        <Titre text={"Informations rembourssement"}/>
        {medicament["prixTTC"] ? 
        <View>
          <View style={styles.infoPrix}>
            <LigneView titre={"Prix"} value={toEuro(medicament["prixHT"])}/>
            <LigneView titre={"Honoraires"} value={toEuro(medicament["montantTaxe"])}/>
            <LigneView titre={"Prix avec les honnoraires"} value={toEuro(medicament["prixTTC"])}/>
            <LigneView titre={"Prise en charge de l'Assurance Maladie"} value={toEuro(medicament["tauxRemboursement"])}/>
            <LigneView titre={"Prix après la prise en charge"} value={calcRemboursement(medicament)}/>
          </View> 
        </View>
        : <View >
            <Text style={styles.ligneTitre}>
              Informations inssufisantes 
            </Text>
          </View>
        }
        {/* <Titre text={"Informations rembourssement"}/>
        <View style={styles.infoPrix}>
          <Text>
          prixTTC, honorraire, rembourssementMin (0, 15, 30, 65, 100)
          </Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};
{
  /* <Text style={styles.titre}>
    Nom du médicament : {medicament["denomination"]}
  </Text>
  <Text>Code CIP13 : {medicament["cip13"]}</Text>
  <Text>Code CIS : {medicament["cis"]}</Text>
  <Text>
    Date de commercialisation : {medicament["dateCommercialisation"]}
  </Text>
  <Text>
    Etat de commercialisation : {medicament["etatCommercialisation"]}
  </Text>
  <Text>
    Taux de rembourssement :{" "}
    {medicament["tauxRemboursement"]|| "Inconnu"}
  </Text> */
}

function calcRemboursement(medicament) {
  const prixTTC = parseFloat(medicament["prixTTC"])
  const regex = /\d+(\.\d+)?/;
  const tauxRemboursement = parseInt(medicament["tauxRemboursement"].match(regex)[0]);
  return toEuro((prixTTC * (1 - tauxRemboursement/100)).toFixed(2), ".");
}

function toEuro(prix, del = ",") {
  if (prix === "0.00") return "Gratuit"
  return prix.replace(del, "€");
}

function LigneView({ titre, value }) {
  return (
    <View style={styles.ligne}>
      <Text style={styles.ligneTitre}>
        {titre} :{' '}
      </Text>
      
      <Text style={styles.ligneValue}>
        {value}
      </Text>
    </View>
  );
}

function Titre({text}) {
  return (
    <View style={{flexDirection: "row", alignItems: "center", paddingVertical:"4%"}}>
      <View style={{flex: 1, height: 1, backgroundColor: 'black'}}/>
      <Text style={styles.titre}>
        {text}
      </Text>
      <View style={{flex: 1, height: 1, backgroundColor: 'black'}}/>
    </View>
  )
}

export default MedicamentView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    // left: "5%",
    // width: "90%",
    height: "100%",
    borderRadius: 10,
  },
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal: "5%",
    paddingTop: "5%",
  },
  denomination: {
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  ligne: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: "1%",
  },
  ligneTitre: {
    fontWeight: "900",
    fontSize: 15,
  },
  ligneValue: {
    flex: 1,
    fontSize: 15,
  },
  titre: {
    textAlign: "center",
    width: "35%",
    fontSize: 15,
  }
});
