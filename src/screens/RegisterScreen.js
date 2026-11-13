import React, { useContext, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { validarRegistro } from "../utils/validaciones";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

export default function RegisterScreen({ navigation }) {
  const { registrar } = useContext(AuthContext);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [repetir, setRepetir] = useState("");

  async function crearCuenta() {
    const errorValidacion = validarRegistro(usuario, password, repetir);
    if (errorValidacion) {
      Alert.alert("Error", errorValidacion);
      return;
    }
    const errorRegistro = await registrar(usuario, password);
    if (errorRegistro) {
      Alert.alert("Error", errorRegistro);
      return;
    }
    Alert.alert("Listo", "Cuenta creada, ya podés iniciar sesión");
    navigation.navigate("Login");
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Registro</Text>
      <CustomInput valor={usuario} onChange={setUsuario} placeholder="Usuario" />
      <CustomInput valor={password} onChange={setPassword} placeholder="Contraseña" secure />
      <CustomInput valor={repetir} onChange={setRepetir} placeholder="Repetir contraseña" secure />
      <CustomButton titulo="Registrarme" onPress={crearCuenta} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: "center", padding: 24 },
  titulo: { fontSize: 26, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
});