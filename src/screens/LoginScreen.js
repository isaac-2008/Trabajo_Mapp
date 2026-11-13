import React, { useContext, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  async function ingresar() {
    const error = await login(usuario, password);
    if (error) Alert.alert("Error", error);
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Iniciar sesión</Text>
      <CustomInput valor={usuario} onChange={setUsuario} placeholder="Usuario" />
      <CustomInput valor={password} onChange={setPassword} placeholder="Contraseña" secure />
      <CustomButton titulo="Ingresar" onPress={ingresar} />
      <CustomButton titulo="Crear cuenta" onPress={() => navigation.navigate("Registro")} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: "center", padding: 24 },
  titulo: { fontSize: 26, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
});