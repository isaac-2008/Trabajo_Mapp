import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { PinsContext } from "../context/PinsContext";
import CustomButton from "../components/CustomButton";

export default function ListScreen() {
  const { usuario } = useContext(AuthContext);
  const { pines, eliminarPin } = useContext(PinsContext);

  // Los más nuevos primero
  const lista = [...pines].reverse();

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.vacio}>Todavía no hay pines. Agregá uno desde el mapa.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>Pin agregado por {item.autor}</Text>
            <Text style={styles.coord}>
              {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
            </Text>
            {item.autor === usuario.nombre ? (
              <CustomButton
                titulo="Eliminar pin"
                onPress={() => eliminarPin(item.id, usuario.nombre)}
              />
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 16 },
  item: { padding: 14, backgroundColor: "#eef", borderRadius: 8, marginBottom: 10 },
  nombre: { fontSize: 18, fontWeight: "bold" },
  coord: { color: "#555", marginBottom: 6 },
  vacio: { textAlign: "center", marginTop: 30, color: "#555" },
});
