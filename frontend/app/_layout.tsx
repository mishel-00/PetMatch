//Mismo archivo que el HomeStack para el tema de la negacion que este todo claro entre las pantallas y saber donde navega cada una
import React from "react";
import LoginScreen from "./login";
import DrawerContent from "@/components/DrawerContent";
import { createDrawerNavigator, DrawerContentComponentProps } from "@react-navigation/drawer";
import TabsNavigator from "./(tabs)/TabsNavigator";
import RegisterScreen from "./(tabs)/RegisterScreen";
import HomeAdoptante from "@/components/HomeAdoptante";
import HomeAsociacion from "@/components/HomeAsociacion";
import ListaAnimales from "@/components/ListaAnimales";
import CrearAnimal from "@/components/CrearAniaml";
import AnimalDetalle from "@/components/AnimalDetalle";
import EditarAnimal from "@/components/EtidarAnimal"; // asegúrate que esté bien escrito
import HomeStack from "./(tabs)/HomeStack";
import HorarioDisponible from "@/components/HorarioDisponible";
import AnimalesAsociacion from "@/components/AnimalesAsociacion";
import AnimalDetalleAdoptante from "@/components/AnimalDetalleAdoptante";
import ListaCitasAsociacion from "@/components/ListaCitasAsociacion";
import CitasAdoptante from "@/components/CitasAdoptante";
import CitaDetalle from "@/components/CitaDetalle";
import EscanearQR from "@/components/EscanearQR";

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <Drawer.Navigator
      drawerContent={(props: DrawerContentComponentProps) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
      }}
    >
      {/* cambios */}
      {/* Las diferentes pantallas de navegacion */}
      <Drawer.Screen name="Home" component={TabsNavigator} options={{ headerTitle: "Home" }} />
      <Drawer.Screen name="Login" component={LoginScreen} options={{ headerTitle: "Iniciar Sesión" }} />
      <Drawer.Screen name="Register" component={RegisterScreen} options={{ headerTitle: "Registro" }} />
      <Drawer.Screen name="HomeAdoptante" component={HomeAdoptante} options={{ headerTitle: "Inicio Adoptante" }} />
      <Drawer.Screen name="HomeAsociacion" component={HomeAsociacion} options={{ headerTitle: "Inicio Asociación" }} />
      <Drawer.Screen name="ListaAnimales" component={ListaAnimales} options={{ headerTitle: "Animales" }} />
      <Drawer.Screen name="CrearAnimal" component={CrearAnimal} options={{ drawerLabel: "Crear Animal" }} />
      <Drawer.Screen name="AnimalDetalle" component={AnimalDetalle} options={{drawerLabel: "Animal detalle"}}/>
      <Drawer.Screen name="EditarAnimal" component={EditarAnimal} options={{drawerLabel: "Animal detall"}}/>
      <Drawer.Screen name="HorarioDisponible" component={HorarioDisponible} options={{drawerLabel: "Horario Disponibles"}}/>
      <Drawer.Screen name="AnimalesAsociacion" component={AnimalesAsociacion} options={{drawerLabel: "Animales Asociacion"}}/>
      <Drawer.Screen name="AnimalDetalleAdoptante" component={AnimalDetalleAdoptante} options={{drawerLabel: "Animal Detalle "}}/>
      <Drawer.Screen name="ListaCitasAsociacion" component={ListaCitasAsociacion} options={{drawerLabel: "Lista Citas "}}/>
      <Drawer.Screen name="CitasAdoptante" component={CitasAdoptante} options={{drawerLabel: "Mis Citas "}}/>
      <Drawer.Screen name="CitaDetalle" component={CitaDetalle} options={{drawerLabel: "Mis Citas "}}/>
      <Drawer.Screen name="EscanearQR" component={EscanearQR} options={{drawerLabel: "EscanearQR "}}/>

      


      
      
    </Drawer.Navigator>
  );
}
