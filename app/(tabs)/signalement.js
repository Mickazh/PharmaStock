import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Button,
  PermissionsAndroid,
  Platform,
  Animated,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { IP_SERVER } from "../config/config";
import SignalementView from "../components.js/views/SignalementView";
import { FontAwesome6 } from "@expo/vector-icons";
import Colors from "../Utils/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Autocomplete from "react-native-autocomplete-input";
import { Entypo } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
console.disableYellowBox = true; 
const INITIAL_REGION_PARIS = {
  latitude: 48.866667,
  longitude: 2.333333,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};
const INITIAL_REGION = {
  latitude: 48.866666,
  longitude: 2.333333,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};
const Signalement = () => {
  const [markers, setMarkers] = useState([]);

  const scrollViewRef = useRef();
  const [pharmacie, setPharmacie] = useState({});
  const scrollRight = () => {
    toggleSBVisibility();
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: Dimensions.get("window").width,
        animated: true,
      });
    }
  };

  const scrollLeft = () => {
    toggleSBVisibility();
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  const [signalementPageIsVisible, setSignalementPageIsVisible] =
    useState(false);
  const markerOnPressHandler = (marker) => {
    setPharmacie(marker);
    scrollRight();
    setSignalementPageIsVisible(true);
  };

  const animation = useRef(new Animated.Value(0)).current;
  //jsp comment ca marche mais ca marche

  const [searchBarVisibility, setSearchBarVisibility] = useState(true);
  function toggleSBVisibility() {
    setSearchBarVisibility(!searchBarVisibility);
  }
  const mapRef = useRef(null);
  const [allPharmacies, setAllPharmacies] = useState([]);
  const [query, setQuery] = useState("");
  const isLoading = !allPharmacies.length;
  const queriedPharmacies = React.useMemo(
    () => filterPharmacies(allPharmacies, query),
    [allPharmacies, query]
  );

  const suggestions = React.useMemo(
    () =>
      queriedPharmacies.length === 1 &&
      comparePharmarcie(queriedPharmacies[0], query)
        ? []
        : queriedPharmacies,
    [queriedPharmacies, query]
  );

  const placeholder = isLoading
    ? "Chargement des données..."
    : "Entrez l'adresse d'une phramacie";

  useEffect(() => {
    (async function fetchPharmacies() {
      setAllPharmacies(await getAllPharmacies());
    })();
  }, []);
  return isLoading ? (
    <View style={{flex: 1, alignContent: "center", justifyContent: "center"}}>
      <ActivityIndicator size="large" color={Colors.vertFonce} />
    </View>
  ) : (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>


        <ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: animation } } }],
            { useNativeDriver: false }
          )}
          pagingEnabled
          persistentScrollbar={true}
          horizontal
          ref={scrollViewRef}
          scrollEventThrottle={16}
        >
          <View style={styles.view}>
          <View style={[styles.autocompleteContainer,{flexDirection:'row'}]}>
            <Entypo name="magnifying-glass" size={35} color="black" style={{position:'absolute',paddingRight:10,right:10,zIndex:2,marginTop:10,backgroundColor:"white"}} />
            <Autocomplete
              editable={!isLoading}
              autoCorrect={false}
              data={suggestions}
              value={query}
              onChangeText={setQuery}
              placeholder={placeholder}
              clearButtonMode="always"
              flatListProps={{
                keyboardShouldPersistTaps: "always",
                keyExtractor: (phar) => phar["id"],
                renderItem: ({ item }) => {
                  return <ItemDisplay pharmacie={item} />;
                },
              }}
            />

          </View>
            <MapView
            
              ref={mapRef}
              radius={50}
              animationEnabled={true}
              initialRegion={INITIAL_REGION_PARIS}
              style={{ flex: 1 }}
              clustering={true}
              onRegionChangeComplete={handleRegionChangeComplete}
            >
              {markers.map((marker, index) => {
                return (
                  <Marker
                    tracksViewChanges={false}
                    key={index}
                    coordinate={marker.coordonneesXY}
                    onPress={() => {
                      markerOnPressHandler(marker);
                    }}
                  >
                    <Fontisto
                      name="map-marker"
                      size={30}
                      color={Colors.rouge}
                    />
                  </Marker>
                );
              })}
            </MapView>
          </View>

          <View style={styles.view}>
            <SignalementView onPress={scrollLeft} pharmacie={pharmacie} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  async function getAllPharmacies() {
    const res = await fetch(`${IP_SERVER}pharmacies/allPharmacies`);
    return res.json();
  }

  function filterPharmacies(pharmacies, adresse) {
    if (!adresse || !pharmacies.length) {
      return [];
    }
    const regex = new RegExp(`${adresse.trim()}`, "i");

    return pharmacies
      .filter((phar) => phar["adressePharmacieComplete"].search(regex) >= 0)
      .slice(0, 5);
  }

  function comparePharmarcie(phar, query) {
    return (
      phar["adressePharmacieComplete"].toLowerCase() ===
      query.toLowerCase().trim()
    );
  }

  function moveMapCamera(pharmacie) {
    if (mapRef.current) {
      const coords = pharmacie["coordonneesXY"];
      const [latitudePharmacie, longitudePharmacie] = coords.split(",");

      const pharmacieRegion = {
        latitude: parseFloat(latitudePharmacie),
        longitude: parseFloat(longitudePharmacie),
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0001,
      };

      mapRef.current.animateCamera(
        {
          center: pharmacieRegion,
          zoom: 20,
        },
        { duration: 3000 }
      );
    }
  }

  function handleRegionChangeComplete(region) {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    const minLatitude = latitude - latitudeDelta / 2;
    const maxLatitude = latitude + latitudeDelta / 2;
    const minLongitude = longitude - longitudeDelta / 2;
    const maxLongitude = longitude + longitudeDelta / 2;

    const bound = {
      minLat: minLatitude,
      maxLat: maxLatitude,
      minLon: minLongitude,
      maxLon: maxLongitude,
    };

    const pharmaciesInRegion = allPharmacies
      .filter((pharmacie) => {
        const coords = pharmacie["coordonneesXY"];
        return (
          (coords !== "" || coords !== undefined) &&
          coordsInRegion(pasreCoords(coords), bound)
        );
      })
      .map((pharmacie) => {
        return {
          ...pharmacie,
          coordonneesXY: pasreCoords(pharmacie["coordonneesXY"]),
        };
      });
    setMarkers(pharmaciesInRegion);
  }

  function pasreCoords(coords) {
    const [latStr, lonStr] = coords.split(",");
    return {
      latitude: parseFloat(latStr),
      longitude: parseFloat(lonStr),
    };
  }
  function coordsInRegion(coords, region) {
    return (
      coords["latitude"] >= region["minLat"] &&
      coords["latitude"] <= region["maxLat"] &&
      coords["longitude"] >= region["minLon"] &&
      coords["longitude"] <= region["maxLon"]
    );
  }

  function ItemDisplay({ pharmacie }) {
    return (
      <TouchableOpacity
        style={styles.itemText}
        onPress={() => {
          moveMapCamera(pharmacie);
          setQuery(pharmacie["adressePharmacieComplete"]);
        }}
      >
        <Text style={styles.itemTitle}>{pharmacie["nomPharmacie"]}</Text>
        <Text style={styles.itemDetail}>
          <Entypo name="location-pin" size={18} color="black" />{" "}
          {pharmacie["adressePharmacieSimple"]} {pharmacie["codePostale"]}{" "}
          {pharmacie["departement"]}
        </Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  view: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  container: {
    position: "relative",
    backgroundColor: "#F5FCFF",
    flex: 1,
    zIndex: 50,
    paddingTop: 0,

    ...Platform.select({
      android: {
        marginTop: 25,
      },
      default: {
        marginTop: 0,
      },
    }),
  },
  itemText: {
    borderBottomColor: Colors.gris,
    borderBottomWidth: 1,
    fontSize: 15,
    margin: 2,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10,
    padding: 5,
  },
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  itemDetail: {
    fontSize: 16,
    paddingLeft: 0,
  },
});

export default Signalement;