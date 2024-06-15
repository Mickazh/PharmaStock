import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { IP_SERVER } from "../config/config";
import colors from "../Utils/Colors";
import MedicamentView from "./medicamentView";
import Colors from "../Utils/Colors";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const medicamentId = () => {
  const local = useLocalSearchParams();
  const cip13 = local.medicamentId;
  const [isLoading, setIsLoading] = useState(true);
  const [medicament, setMedicament] = useState();
  
  const insets = useSafeAreaInsets();
  useEffect(() => {
    fetchMedicament(cip13);
  }, []);
  const fetchMedicament = async (cip13) => {
    fetch(`${IP_SERVER}medicaments/searchWithCIP13?CIP13=${cip13}`)
      .then((res) => res.json())
      .then((data) => {
        setMedicament(data);
        setIsLoading(false);
      });
  };

  return isLoading ? (
    <View style={styles.loaderContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <ActivityIndicator size="large" color={colors.vertFonce} />
    </View>
  ) : (
    <View>
      <Stack.Screen
        options={{ headerShown: true, headerTitle: "Informations" }}
      />
      <MedicamentView medicament={medicament} />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export default medicamentId;
