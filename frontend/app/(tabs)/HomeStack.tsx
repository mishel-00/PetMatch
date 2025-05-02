//Este es las difrentes pantallas de la aplicacion para el tema de la negacion entre pantallas y poder pasar datos 
// de una pantalla a otra osea arrastrar datos
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
import EditarAnimal from "@/components/EtidarAnimal";
import HorarioDisponible from "@/components/HorarioDisponible";
import AnimalesAsociacion from "@/components/AnimalesAsociacion";
import AnimalDetalleAdoptante from "@/components/AnimalDetalleAdoptante";
const Stack = createNativeStackNavigator<RootStackParamList>();



export type RootStackParamList = {
    HomeScreen: undefined;
    RegisterScreen: undefined;
    Login: undefined;
    HomeAdoptante: undefined;
    HomeAsociacion: undefined;
    ListaAnimales: undefined
    AnimalDetalle: {id : string };
    CrearAnimal : undefined
    EditarAnimal: { id : string };
    HorarioDisponible : undefined;
    AnimalesAsociacion: { asociacionId: string; nombre: string };
    AnimalDetalleAdopnate : {id : string }

};
  

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }} />
         <Stack.Screen
             name="Login" 
             component={LoginScreen} />

            <Stack.Screen
             name="RegisterScreen" 
             component={RegisterScreen} />

            <Stack.Screen
             name="HomeAdoptante"
             component={HomeAdoptante}
            options={{ headerShown: false }} />

            <Stack.Screen
             name="HomeAsociacion"
            component={HomeAsociacion}
            options={{ headerShown: false }} />
            
            <Stack.Screen
            name="ListaAnimales"
            component={ListaAnimales}
            options={{ headerTitle: "Lista de Animales" }} />

            <Stack.Screen
            name="AnimalDetalle"
            component={AnimalDetalle}
            options={{ headerTitle: "Detalles del Animal" }} />

            <Stack.Screen
            name="CrearAnimal"
            component={CrearAnimal}
            options={{ headerTitle: "CrearAnimal" }} />

            <Stack.Screen 
            name="EditarAnimal" 
            component={EditarAnimal} 
            options={{ headerTitle: "Editar Animal" }} />
            <Stack.Screen 
            name="HorarioDisponible" 
            component={HorarioDisponible} 
            options={{ headerTitle: "Horario Disponible" }} />
            <Stack.Screen 
            name="AnimalesAsociacion" 
            component={AnimalesAsociacion} />

            <Stack.Screen 
            name="AnimalDetalleAdopnate" 
            component={AnimalDetalleAdoptante} 
            options={{ headerTitle: "Horario Disponible" }} />


        </Stack.Navigator>
    );


}

