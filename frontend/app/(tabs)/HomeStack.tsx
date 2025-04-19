import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import RegisterScreen from "./RegisterScreen";
import LoginScreen from "../login";
import HomeAdoptante from "@/components/HomeAdoptante";
import HomeAsociacion from "@/components/HomeAsociacion";
const Stack = createNativeStackNavigator<RootStackParamList>();


export type RootStackParamList = {
    HomeScreen: undefined;
    RegisterScreen: undefined;
    Login: undefined;
    HomeAdoptante: undefined;
    HomeAsociacion: undefined;
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

        </Stack.Navigator>
    );


}

