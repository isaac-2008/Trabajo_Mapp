import React, { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PinsContext = createContext({
  pines: [],
  agregarPin: () => {},
  eliminarPin: () => {},
});

const CLAVE = "pines"; // pines compartidos: los ven todos los usuarios

export function PinsProvider({ children }) {
  const [pines, setPines] = useState([]);
  const pinesRef = useRef([]); // siempre tiene la lista más actual

  // Carga los pines guardados al abrir la app (y recupera los de versiones viejas)
  useEffect(() => {
    async function cargar() {
      try {
        const texto = await AsyncStorage.getItem(CLAVE);
        let lista = texto ? JSON.parse(texto) : [];

        // Pines guardados antes por usuario ("pines:nombre"): se juntan en la lista común
        const claves = await AsyncStorage.getAllKeys();
        const viejas = claves.filter((k) => k.startsWith("pines:"));
        for (const clave of viejas) {
          const t = await AsyncStorage.getItem(clave);
          const dueno = clave.slice("pines:".length);
          const items = t ? JSON.parse(t) : [];
          items.forEach((p) => {
            if (!lista.some((x) => x.id === p.id)) {
              lista.push({ ...p, autor: p.autor || dueno, esPin: true });
            }
          });
          await AsyncStorage.removeItem(clave);
        }
        if (viejas.length > 0) {
          await AsyncStorage.setItem(CLAVE, JSON.stringify(lista));
        }

        pinesRef.current = lista;
        setPines(lista);
      } catch (e) {
        console.log(e);
      }
    }
    cargar();
  }, []);

  async function guardar(lista) {
    pinesRef.current = lista;
    setPines(lista);
    try {
      await AsyncStorage.setItem(CLAVE, JSON.stringify(lista));
    } catch (e) {
      console.log(e);
    }
  }

  function agregarPin(pin) {
    guardar([...pinesRef.current, pin]);
  }

  // Solo elimina si el pin lo puso ese usuario
  function eliminarPin(id, nombreUsuario) {
    const pin = pinesRef.current.find((p) => p.id === id);
    if (!pin || pin.autor !== nombreUsuario) return;
    guardar(pinesRef.current.filter((p) => p.id !== id));
  }

  return (
    <PinsContext.Provider value={{ pines, agregarPin, eliminarPin }}>
      {children}
    </PinsContext.Provider>
  );
}
