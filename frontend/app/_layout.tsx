import React from "react";
import LoginScreen from "./login";
import DrawerContent from "@/components/DrawerContent";
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import TabsNavigator from "./(tabs)/TabsNavigator";
import RegisterScreen from "./(tabs)/RegisterScreen";
import HomeAdoptante from "@/components/HomeAdoptante";
import HomeAsociacion from "@/components/HomeAsociacion";
import ListaAnimales from "@/components/ListaAnimales";
import CrearAnimal from "@/components/CrearAniaml";
import AnimalDetalle from "@/components/AnimalDetalle";


const Drawer = createDrawerNavigator();

export default function Layout() {
    return (
        <Drawer.Navigator
            drawerContent={(props: React.JSX.IntrinsicAttributes & DrawerContentComponentProps) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: true, 
                headerTitleAlign: "center", 
                headerStyle: {
                    backgroundColor: "#fff",
                },
                headerTintColor: "#000", 
            }}
        >
            <Drawer.Screen name="Home" component={TabsNavigator} options={{ headerTitle: "Home" }} />
            <Drawer.Screen name="Login" component={LoginScreen} options={{ headerTitle: "Iniciar Sesión" }} />
            <Drawer.Screen name="Register" component={RegisterScreen} options={{ headerTitle: "Registro" }} />
            <Drawer.Screen name="HomeAdoptante" component={HomeAdoptante} options={{ headerTitle: "Inicio Adoptante" }} />
            <Drawer.Screen name="HomeAsociacion" component={HomeAsociacion} options={{ headerTitle: "Inicio Asociación" }} />
            <Drawer.Screen
  name="ListaAnimales"
  component={ListaAnimales}
  options={{ headerTitle: "Animales" }}
/>
<Drawer.Screen
  name="CrearAnimal"
  component={CrearAnimal}
  options={{ drawerLabel: "Crear Animal" }}
/>



        </Drawer.Navigator>



    );
}