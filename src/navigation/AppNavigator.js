import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import AppDrawer from "./AppDrawer";

export default function AppNavigator() {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? <AppDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}