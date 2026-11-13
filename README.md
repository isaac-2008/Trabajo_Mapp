# Trabajo Práctico Final – App de pines en mapa

Aplicación hecha con **React Native + Expo** que permite registrarse, iniciar sesión y
colocar pines en un mapa. Todos los usuarios ven todos los pines, pero cada usuario
solo puede eliminar los que puso él.

## Funcionalidades

- Registro de usuario y contraseña con validaciones
- Login con sesión persistente (AsyncStorage) y logout
- Navegación:
  - Sin sesión: Stack (Login / Registro)
  - Con sesión: Drawer + Tabs (Mapa / Lugares)
- Mapa con marcadores (react-native-maps en celular, Leaflet + OpenStreetMap en web)
- Agregar pines tocando el mapa o en la ubicación actual (expo-location)
- Pestaña **Lugares** con la lista de todos los pines
- Solo el autor de un pin puede eliminarlo

## Estructura

```
App.js
index.js
src/
├── components/   CustomButton, CustomInput, MapaLugares (.js celular / .web.js web)
├── context/      AuthContext (sesión), PinsContext (pines)
├── navigation/   AppNavigator, AuthStack, AppDrawer, AppTabs
├── screens/      LoginScreen, RegisterScreen, MapScreen, ListScreen
└── utils/        validaciones
```

## Cómo ejecutarlo

Requisitos: [Node.js](https://nodejs.org) y la app **Expo Go** en el celular.

```bash
npm install
npx expo start
```

- Escaneá el QR con Expo Go para verlo en el celular.
- Presioná `w` en la terminal para abrirlo en el navegador.

## Notas

- Los usuarios y los pines se guardan en el dispositivo (AsyncStorage), no en un servidor.
- El mapa del celular usa react-native-maps; en web se usa Leaflet y necesita internet.
