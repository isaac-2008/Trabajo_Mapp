import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, Alert, Modal, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { AuthContext } from "../context/AuthContext";
import { PinsContext } from "../context/PinsContext";
import MapaLugares from "../components/MapaLugares";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

// El mapa solo muestra los pines de los usuarios
const SIN_LUGARES = [];

export default function MapScreen() {
  const { usuario } = useContext(AuthContext);
  const { pines, agregarPin, eliminarPin } = useContext(PinsContext);

  const [miUbicacion, setMiUbicacion] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [modoAgregar, setModoAgregar] = useState(false);
  const modoRef = useRef(false); // siempre tiene el valor actual del modo
  const [ultimoToque, setUltimoToque] = useState(null);
  const [nuevaCoord, setNuevaCoord] = useState(null);
  const [nombrePin, setNombrePin] = useState("");

  // Ubicación del usuario
  useEffect(() => {
    async function obtenerUbicacion() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso denegado", "No se podrá mostrar tu ubicación");
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        setMiUbicacion({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } catch (e) {
        console.log(e);
      }
    }
    obtenerUbicacion();
  }, []);

  // Tocar el mapa en modo "agregar pin" abre el cuadro para ponerle nombre
  function cambiarModo(valor) {
    modoRef.current = valor;
    setModoAgregar(valor);
  }

  function alTocarMapa(coord) {
    setUltimoToque(coord);
    if (!modoRef.current) return;
    setNuevaCoord(coord);
    setNombrePin("");
  }

  // Respaldo: pone el pin en tu ubicación (o en el centro del pueblo)
  function agregarAca() {
    const base = miUbicacion || { latitude: -31.87, longitude: -62.72 };
    // Pequeño desplazamiento (unos 20-30 m) para que los pines no queden encimados
    const coord = {
      latitude: base.latitude + (Math.random() - 0.5) * 0.0005,
      longitude: base.longitude + (Math.random() - 0.5) * 0.0005,
    };
    setNuevaCoord(coord);
    setNombrePin("");
  }

  function confirmarPin() {
    const nombre = nombrePin.trim() === "" ? "Mi pin" : nombrePin.trim();
    const nuevo = {
      id: Date.now().toString(),
      nombre: nombre,
      descripcion: "Pin agregado por " + usuario.nombre,
      autor: usuario.nombre,
      latitude: nuevaCoord.latitude,
      longitude: nuevaCoord.longitude,
      esPin: true,
    };
    agregarPin(nuevo);
    setNuevaCoord(null);
    cambiarModo(false);
  }

  // El pin es mío si lo puse yo
  function esMio(pin) {
    return pin.autor === usuario.nombre;
  }

  function borrarPin(pin) {
    // Solo el usuario que puso el pin puede eliminarlo
    if (!esMio(pin)) return;
    eliminarPin(pin.id, usuario.nombre);
    setSeleccionado(null);
  }

  const pinSeleccionado = seleccionado && seleccionado.esPin ? seleccionado : null;

  let textoUbicacion = "Obteniendo ubicación...";
  if (miUbicacion) {
    textoUbicacion =
      "Tu ubicación: " +
      miUbicacion.latitude.toFixed(5) +
      ", " +
      miUbicacion.longitude.toFixed(5);
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.ubicacion}>{textoUbicacion}</Text>

      <View style={styles.barra}>
        <CustomButton
          titulo={modoAgregar ? "Cancelar" : "Agregar pin"}
          onPress={() => cambiarModo(!modoAgregar)}
        />
        <CustomButton titulo="Agregar pin en mi ubicación" onPress={agregarAca} />
        {modoAgregar ? (
          <Text style={styles.aviso}>Tocá el mapa para colocar el pin</Text>
        ) : (
          <Text style={styles.aviso}>Mis pines: {pines.filter((p) => p.autor === usuario.nombre).length} | Total: {pines.length}</Text>
        )}
        {ultimoToque ? (
          <Text style={styles.aviso}>
            Último toque: {ultimoToque.latitude.toFixed(4)}, {ultimoToque.longitude.toFixed(4)}
          </Text>
        ) : null}
      </View>

      <MapaLugares
        lugares={SIN_LUGARES}
        pines={pines}
        onSeleccionar={setSeleccionado}
        onMapaPress={alTocarMapa}
      />

      {/* Pines de los usuarios */}
      <Modal visible={pinSeleccionado !== null} transparent animationType="fade">
        <View style={styles.fondo}>
          <View style={styles.caja}>
            <Text style={styles.titulo}>
              {pinSeleccionado ? pinSeleccionado.nombre : ""}
            </Text>
            <Text style={styles.aviso}>
              {pinSeleccionado ? "Pin agregado por " + (pinSeleccionado.autor || usuario.nombre) : ""}
            </Text>
            {pinSeleccionado && esMio(pinSeleccionado) ? (
              <CustomButton
                titulo="Eliminar pin"
                onPress={() => borrarPin(pinSeleccionado)}
              />
            ) : (
              <Text style={styles.aviso}>
                Solo quien puso el pin puede eliminarlo
              </Text>
            )}
            <CustomButton titulo="Cerrar" onPress={() => setSeleccionado(null)} />
          </View>
        </View>
      </Modal>

      <Modal visible={nuevaCoord !== null} transparent animationType="fade">
        <View style={styles.fondo}>
          <View style={styles.caja}>
            <Text style={styles.titulo}>Nuevo pin</Text>
            <CustomInput
              valor={nombrePin}
              onChange={setNombrePin}
              placeholder="Nombre del pin"
            />
            <CustomButton titulo="Guardar" onPress={confirmarPin} />
            <CustomButton titulo="Cancelar" onPress={() => setNuevaCoord(null)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1 },
  ubicacion: { padding: 10, fontWeight: "bold" },
  barra: { paddingHorizontal: 16 },
  aviso: { marginBottom: 6, color: "#444" },
  fondo: { flex: 1, justifyContent: "center", backgroundColor: "#000a" },
  caja: { backgroundColor: "#fff", margin: 20, padding: 16, borderRadius: 12 },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
});
