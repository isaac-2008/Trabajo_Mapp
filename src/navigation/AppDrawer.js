import React, { useContext } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { AuthContext } from "../context/AuthContext";
import AppTabs from "./AppTabs";

const Drawer = createDrawerNavigator();

function ContenidoDrawer(props) {
  const { logout, usuario } = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem label={"Hola, " + usuario.nombre} onPress={() => {}} />
      <DrawerItemList {...props} />
      <DrawerItem label="Cerrar sesión" onPress={logout} />
    </DrawerContentScrollView>
  );
}

export default function AppDrawer() {
  return (
    <Drawer.Navigator drawerContent={(props) => <ContenidoDrawer {...props} />}>
      <Drawer.Screen name="Inicio" component={AppTabs} />
    </Drawer.Navigator>
  );
}