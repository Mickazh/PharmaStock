import React from "react";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from '@expo/vector-icons';

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#5DB075",
        tabBarStyle: { height: 70 },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="historique"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="clockcircle" size={32} color={color} />
          ),
          transition: "slideRight",
          headerShown: false, 
        }}
      />

      <Tabs.Screen
        name="signalement"
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <FontAwesome size={32} name="warning" color={color} />
            </View>
          ),
          transition: "slideRight",
          headerShown: false, 
        }}
      />

      <Tabs.Screen
        name="medicament"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="file-medical" size={32}  color={color} />
          ),
          transition: "slideRight",
          headerShown: false, 
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={32} name="user" color={color} />
          ),
          transition: "slideRight",
          headerShown: false, 
        }}
      />
      <Tabs.Screen name="connexionEnregistrement" options={{ transition: "slideRight" , headerShown: false,href:null }} />
      <Tabs.Screen name="mdpOublie" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
