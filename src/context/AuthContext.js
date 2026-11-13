import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al abrir la app, revisa si hay sesión guardada
  useEffect(() => {
    async function cargarSesion() {
      try {
        const guardado = await AsyncStorage.getItem("sesion");
        if (guardado) setUsuario(JSON.parse(guardado));
      } catch (e) {
        console.log(e);
      }
      setCargando(false);
    }
    cargarSesion();
  }, []);

  async function registrar(nombre, password) {
    const texto = await AsyncStorage.getItem("usuarios");
    const lista = texto ? JSON.parse(texto) : [];

    const existe = lista.find((u) => u.nombre === nombre);
    if (existe) return "Ese usuario ya existe";

    lista.push({ nombre, password });
    await AsyncStorage.setItem("usuarios", JSON.stringify(lista));
    return null;
  }

  async function login(nombre, password) {
    const texto = await AsyncStorage.getItem("usuarios");
    const lista = texto ? JSON.parse(texto) : [];

    const encontrado = lista.find(
      (u) => u.nombre === nombre && u.password === password
    );
    if (!encontrado) return "Usuario o contraseña incorrectos";

    await AsyncStorage.setItem("sesion", JSON.stringify({ nombre }));
    setUsuario({ nombre });
    return null;
  }

  async function logout() {
    await AsyncStorage.removeItem("sesion");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, registrar, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}