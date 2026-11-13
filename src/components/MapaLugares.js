import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const REGION_INICIAL = {
  latitude: -31.87,
  longitude: -62.72,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

// Versión para celular (Android / iOS)
export default function MapaLugares({ lugares, pines, onSeleccionar, onMapaPress }) {
  const mapRef = useRef(null);

  // Ajusta el zoom para que se vean todos los marcadores
  function ajustar() {
    if (lugares.length === 0) return;
    mapRef.current?.fitToCoordinates(
      lugares.map((l) => ({ latitude: l.latitude, longitude: l.longitude })),
      { edgePadding: { top: 60, right: 60, bottom: 60, left: 60 }, animated: true }
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.mapa}
      initialRegion={REGION_INICIAL}
      showsUserLocation
      onMapReady={ajustar}
      onPress={(e) => onMapaPress(e.nativeEvent.coordinate)}
    >
      {lugares.map((l) => (
        <Marker
          key={l.id}
          coordinate={{ latitude: l.latitude, longitude: l.longitude }}
          title={l.nombre}
          onPress={() => onSeleccionar(l)}
        />
      ))}
      {pines.map((p) => (
        <Marker
          key={p.id}
          coordinate={{ latitude: p.latitude, longitude: p.longitude }}
          title={p.nombre}
          onPress={() => onSeleccionar(p)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({ mapa: { flex: 1 } });
