import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import RegisterScreen from "./RegisterScreen";
import LoginScreen from "../login";
import HomeAdoptante from "@/components/HomeAdoptante";
import HomeAsociacion from "@/components/HomeAsociacion";
import AnimalDetalle from "@/components/AnimalDetalle";
import { Animal } from "@/types/types";
import CrearAnimal from "@/components/CrearAniaml";
import ListaAnimales from "@/components/ListaAnimales";
const Stack = createNativeStackNavigator<RootStackParamList>();



export type RootStackParamList = {
    HomeScreen: undefined;
    RegisterScreen: undefined;
    Login: undefined;
    HomeAdoptante: undefined;
    HomeAsociacion: undefined;
    ListaAnimales: undefined
    AnimalDetalle: { animal: Animal };
    CrearAnimal : undefined
};
  

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
         <Stack.Screen
             name="Login" 
             component={LoginScreen} 
             />
            <Stack.Screen
             name="RegisterScreen" 
             component={RegisterScreen} 
             />
            <Stack.Screen
             name="HomeAdoptante"
             component={HomeAdoptante}
            options={{ headerShown: false }}
            />
            <Stack.Screen
             name="HomeAsociacion"
            component={HomeAsociacion}
            options={{ headerShown: false }}
                />
                <Stack.Screen
  name="ListaAnimales"
  component={ListaAnimales}
  options={{ headerTitle: "Lista de Animales" }}
/>
                <Stack.Screen
            name="AnimalDetalle"
  component={AnimalDetalle}
  options={{ headerTitle: "Detalles del Animal" }}

/>
<Stack.Screen
  name="CrearAnimal"
  component={CrearAnimal}
  options={{ headerTitle: "CrearAnimal" }}
/>


        </Stack.Navigator>
    );


}

