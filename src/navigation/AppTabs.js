import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "../screens/MapScreen";
import ListScreen from "../screens/ListScreen";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Lugares" component={ListScreen} />
    </Tab.Navigator>
  );
}