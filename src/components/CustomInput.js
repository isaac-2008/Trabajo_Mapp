import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function CustomInput({ valor, onChange, placeholder, secure }) {
  return (
    <TextInput
      style={styles.input}
      value={valor}
      onChangeText={onChange}
      placeholder={placeholder}
      secureTextEntry={secure}
      autoCapitalize="none"
    />
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginVertical: 6 },
});