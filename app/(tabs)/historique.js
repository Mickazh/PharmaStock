import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Button,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { IP_SERVER } from "../config/config";
import Colors from "../Utils/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { getToken, getUserID } from "../Utils/SecureStore";
import { useNavigation } from "expo-router";
import { useFocusEffect } from "expo-router";
import SubmitButton from "../components.js/FormComponents/SubmitButton";
// const idUser = getUserID().then((userId)=>{return userId;});
const Historique = () => {
  // const scrollViewRef = useRef(null);

  // const scrollRight = () => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({ animated: true });
  //   }
  // };

  // const scrollLeft = () => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollTo({x:0, animated: true });
  //   }
  // };

  const [userIsConnected, setUserIsConnected] = useState(false);

  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [signalements, setSignalements] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  useFocusEffect(() => {
    getUserID().then((userID) => {
      if (userID.trim() === "") {
        setUserIsConnected(false);
      } else {
        if(userIsConnected){
          return;
        }
        setUserIsConnected(true);
        fetchData(0, userID);
      }
    });
  });

  const onRefresh = () => {
    setRefreshing(true);
    setPage(0);
    getUserID().then((idUser) => {
      fetchData(0, idUser);
    });
    setRefreshing(false);
  };

  async function fetchData(page, idUser, size = 20) {
    await fetch(
      `${IP_SERVER}historique/getAll?idUser=${idUser}&page=${page}&size=${size}`
    )
      .then((res) => res.json())
      .then((data) => {
        setSignalements(data["content"]);
        if (data["content"].length === 0) setRefreshing(false);
      })
      .catch(() => {
        console.error("erreur fetch dans historique");
      });
  }

  useEffect(() => {
    getUserID().then((userId) => {
      fetchMoreData(userId);
    });
  }, [page]);

  async function handleLoadMore() {
    if (!isLoading && hasMore) {
      setPage(page + 1);
    }
  }

  async function fetchMoreData(idUser, size = 20) {
    if (page === 0) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${IP_SERVER}historique/getAll?idUser=${idUser}&page=${page}&size=${size}`
      );
      const json = await response.json();
      if (json["totalPages"] <= page) {
        setHasMore(false);
      }
      setSignalements([...signalements, ...json["content"]]);
    } catch (error) {
      console.error("erreur fetch dans historique");
    } finally {
      setIsLoading(false);
    }
  }

  const navigation = useNavigation();

  const navigateToLoginPage = () => {
    navigation.navigate("profil");
  };

  const navigateToSignalementPage = () => {
    navigation.navigate("signalement");
  };

  return userIsConnected ? (
    signalements.length !== 0 ? (
      <SafeAreaView style={styles.safeContainer}>
        <Text style={styles.histoHeader}>
          Historique de vos signalements
        </Text>
        <View style={{flexDirection: "row", alignItems: "center", paddingVertical:"4%"}}>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}}/>
        </View>
        <FlatList
          data={signalements}
          renderItem={renderSignalement}
          keyExtractor={(item) =>
            item.signalementPK_ID.dateSignalement.toString()
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReachedThreshold={0.9}
          onEndReached={handleLoadMore}
        />
      </SafeAreaView>
    ) : (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView style={[styles.safeContainer, styles.container]}>
          <Text
            style={{
              width: "90%",
              fontSize: 40,
              paddingBottom: 10,
              fontWeight: 900,
              color: Colors.vertFonce,
              marginTop: 50,
              marginBottom: "50%",
            }}
          >
            Vous n'avez pas encore effectué de signalement. Cliquez sur le
            boutton pour effectuer un signalement
          </Text>

          <SubmitButton
            title={"Signaler"}
            onPressFunction={navigateToSignalementPage}
          ></SubmitButton>
        </SafeAreaView>
      </ScrollView>
    )
  ) : (
    <View style={styles.container}>
      <Text
        style={{
          width: "90%",
          fontSize: 40,
          paddingBottom: 10,
          fontWeight: 900,
          color: Colors.vertFonce,
        }}
      >
        Pour consulter l'historique de vos signalements veuillez vous connecter
      </Text>

      <SubmitButton
        title={"connectez vous"}
        onPressFunction={navigateToLoginPage}
      ></SubmitButton>
    </View>
  );
};

function renderSignalement(signalement) {
  const signalementInfo = signalement["item"]["signalementPK_ID"];
  const pharmacie = signalementInfo["idPharmacie"];
  const medicament = signalementInfo["cip13"];
  const dateSignalement = new Date(signalementInfo["dateSignalement"]);

  return (
    <View style={{ width: "95%", paddingLeft: "5%" }}>
      <View style={[styles.card]}>
        <View>
          <Text style={[styles.heading, styles.text]}>
            <AntDesign name="calendar" size={18} color="black" />{" "}
            <DateDisplay date={dateSignalement} />
          </Text>
        </View>
        <View>
          <View>
            <Text style={styles.text}>
              <Entypo name="location-pin" size={18} color="black" />{" "}
              {pharmacie["nomPharmacie"]} - {pharmacie["departement"]}
            </Text>
          </View>
          <View>
            <Text style={styles.text}>
              <AntDesign size={18} name="disconnect" color="black" />{" "}
              {medicament["denomination"]}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 13,
  },
  card: {
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.blanc,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },

  safeContainer: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
  },
  text: {
    fontWeight: "900",
    color: Colors.vertFonce,
  },

  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  histoHeader: {
    paddingTop: 10,
    paddingHorizontal: "4%",
    fontWeight: "900",
    fontSize: 18,
    color: Colors.vertFonce,
  },
});

function DateDisplay({ date }) {
  return (
    <Text>
      {jours[date.getDay()]} {date.getDate()} {mois[date.getMonth() - 1]}{" "}
      {date.getFullYear()} {leftPad(date.getHours())}h{leftPad(date.getMinutes())}
    </Text>
  );
}

function leftPad(num) {
  return ("0"+num).slice(-2)
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

export default Historique;
