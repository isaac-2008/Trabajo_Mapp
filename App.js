import "react-native-gesture-handler";
import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import { PinsProvider } from "./src/context/PinsContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <PinsProvider>
        <AppNavigator />
      </PinsProvider>
    </AuthProvider>
  );
}
