import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
// import { API } from "@env";
// import {  } from "@env";
import { IP_SERVER } from "../config/config";
import React, { useEffect, useMemo, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Fontisto } from "@expo/vector-icons";
import { Link } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../Utils/Colors";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const medicament = () => {
  const [medicamentName, setMedicamentName] = useState("");
  const [medicaments, setMedicaments] = useState([]);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // const medicamentMemo = useMemo(
  //   () => handleTextChange(medicamentName),
  //   [medicamentName]
  // );

  function handleLoadMore() {
    if (!loading && hasMore) {
      setPage(page + 1);
      fetchMoreData(medicamentName);
    }
  }

  async function fetchMoreData(name) {
    setLoading(true);
    try {
      const response = await fetch(
        `${IP_SERVER}medicaments/searchWithPName?name=${name}&size=70&page=${page}`
      );
      const json = await response.json();
      if (json["totalPages"] <= page) {
        setHasMore(false);
      }
      setMedicaments([...medicaments, ...json["content"]]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTextChange(name) {
    setHasMore(true);
    try {
      const response = await fetch(
        `${IP_SERVER}medicaments/searchWithPName?name=${name}&size=70&page=${page}`
      );
      const json = await response.json();
      setPage(page + 1);
      setMedicaments(json["content"]);
    } catch (error) {
      console.error(error);
    }
  }

  function name(params) {}

  function createMedicamentList(medicaments) {}

  useEffect(() => {
    async () => {
      handleTextChange(medicamentName);
    }
  }, []);

  useEffect(() => {
    handleTextChange(medicamentName);
  }, [medicamentName]);
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View
        style={{
          marginBottom: windowHeight / 30,
        }}
      >
        <View>
          <TextInput
            style = {styles.searchBar}
            onChangeText={(changedText) => {
              setPage(0);
              setMedicamentName(changedText);
            }}
            value={medicamentName}
            placeholder="Rechercher un médicmament"
            clearButtonMode="always"
          />
        </View>
        <FlatList
          data={medicaments}
          renderItem={({ item }) => (
            <View
              style={{
                // backgroundColor: "#fff",
                width: "95%",
                paddingLeft: "5%",
              }}
            >
              <View style={[styles.card, styles.elevation]}>
                <Link href={`/medicament/${item["cip13"]}`}>
                  <View>
                    <Text
                      style={[styles.heading, styles.text]}
                      ellipsizeMode="tail"
                      numberOfLines={3}
                    >
                      <AntDesign size={20} name="disconnect" color="black" />{" "}
                      {item["denomination"]}
                    </Text>
                    <View style={styles.detailContainer}>
                      <AntDesign name="calendar" size={20} color="black" />
                      <Text style={styles.text}> {item["dateCommercialisation"]}</Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <MaterialCommunityIcons
                        name="office-building-outline"
                        size={20}
                        color="black"
                      />
                      <Text style={[styles.maxCardWidth, styles.text]}>
                        {" "}
                        {item["titulaire"].trim()}
                      </Text>
                    </View>
                    <View style={styles.detailContainer}>
                      <Ionicons
                        name="pricetag-outline"
                        size={20}
                        color="black"
                      />
                      <Text style={styles.text}> {toEuro(item["prixTTC"])}</Text>
                    </View>
                  </View>
                </Link>
              </View>
            </View>
          )}
          onEndReached={() => {
            handleLoadMore();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => {
            if (!loading && hasMore) {
              return <Text>Loading more...</Text>;
            } else if (!hasMore) {
              return <Text>No more items to load.</Text>;
            }
            return <View></View>;
          }}
        />
      </View>
    </SafeAreaView>
  );
};

function toEuro(prix) {
  prixEuro = parseFloat(prix);
  return isNaN(prixEuro) ? "Iconnu" : prix.replace(",", "€");
}

export default medicament;

const styles = StyleSheet.create({
  safeContainer: {
    // backgroundColor: Colors.vertFonce,
    flex:1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  item: {
    height: windowHeight / 15,
    marginVertical: 5,
  },

  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 13,
    width: windowWidth * 0.8,
  },

  maxCardWidth: {
    width: windowWidth * 0.8,
  },

  detailContainer: {
    flex: 1,
    flexDirection: "row",
  },

  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  card: {
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
  elevation: {
    elevation: 20,
    shadowColor: "black",
  },
  text: {
    fontWeight: "900",
    color: Colors.vertFonce
  },
  searchBar: {
    paddingLeft: "5%",
    marginTop: "5%",
  },
});
