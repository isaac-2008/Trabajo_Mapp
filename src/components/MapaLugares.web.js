import React, { useEffect, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";

// Versión para web: mapa real con Leaflet + OpenStreetMap dentro de un iframe
function crearHtml(lugares) {
  const datos = JSON.stringify(
    lugares.map((l) => ({
      id: l.id,
      nombre: l.nombre,
      lat: l.latitude,
      lng: l.longitude,
    }))
  );
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>html,body,#map{height:100%;margin:0}</style>
</head>
<body>
<div id="map"></div>
<script>
  var lugares = ${datos};
  var map = L.map("map").setView([-31.87, -62.72], 15);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  var puntos = [];
  lugares.forEach(function (l) {
    var m = L.marker([l.lat, l.lng]).addTo(map);
    m.bindTooltip(l.nombre);
    m.on("click", function () {
      window.parent.postMessage({ tipo: "lugar", id: l.id }, "*");
    });
    puntos.push([l.lat, l.lng]);
  });
  if (puntos.length > 0) map.fitBounds(puntos, { padding: [40, 40] });

  // Click en el mapa (para agregar pines)
  map.on("click", function (e) {
    window.parent.postMessage(
      { tipo: "mapa", lat: e.latlng.lat, lng: e.latlng.lng }, "*"
    );
  });

  // Pines del usuario (llegan desde la app)
  var capaPines = L.layerGroup().addTo(map);
  window.parent.postMessage({ tipo: "listo" }, "*");
  window.addEventListener("message", function (e) {
    if (!e.data || e.data.tipo !== "pines") return;
    capaPines.clearLayers();
    e.data.pines.forEach(function (p) {
      var c = L.marker([p.latitude, p.longitude]).addTo(capaPines);
      c.bindTooltip(p.nombre);
      c.on("click", function () {
        window.parent.postMessage({ tipo: "pin", id: p.id }, "*");
      });
    });
  });
</script>
</body>
</html>`;
}

export default function MapaLugares({ lugares, pines, onSeleccionar, onMapaPress }) {
  const iframeRef = useRef(null);
  const html = useMemo(() => crearHtml(lugares), [lugares]);

  function enviarPines() {
    const w = iframeRef.current && iframeRef.current.contentWindow;
    if (w) w.postMessage({ tipo: "pines", pines: pines }, "*");
  }

  // Cada vez que cambian los pines, se los manda al mapa
  useEffect(() => {
    enviarPines();
  }, [pines]);

  // Mensajes que llegan desde el mapa
  useEffect(() => {
    function recibir(e) {
      const d = e.data;
      if (!d) return;
      if (d.tipo === "listo") {
        enviarPines();
      } else if (d.tipo === "lugar") {
        const l = lugares.find((x) => x.id === d.id);
        if (l) onSeleccionar(l);
      } else if (d.tipo === "pin") {
        const p = pines.find((x) => x.id === d.id);
        if (p) onSeleccionar(p);
      } else if (d.tipo === "mapa") {
        onMapaPress({ latitude: d.lat, longitude: d.lng });
      }
    }
    window.addEventListener("message", recibir);
    return () => window.removeEventListener("message", recibir);
  }, [lugares, pines, onSeleccionar, onMapaPress]);

  return (
    <View style={styles.contenedor}>
      {React.createElement("iframe", {
        ref: iframeRef,
        title: "mapa",
        srcDoc: html,
        onLoad: enviarPines,
        style: { width: "100%", height: "100%", border: "none" },
      })}
    </View>
  );
}

const styles = StyleSheet.create({ contenedor: { flex: 1 } });
