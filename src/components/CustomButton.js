import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

export default function CustomButton({ titulo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.boton, pressed && { opacity: 0.6 }]}
    >
      <Text style={styles.texto}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: { backgroundColor: "#2563eb", padding: 14, borderRadius: 8, marginVertical: 8 },
  texto: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});