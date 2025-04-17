import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import RegisterScreen from "./RegisterScreen";
import LoginScreen from "../login";
const Stack = createNativeStackNavigator<RootStackParamList>();


export type RootStackParamList = {
    HomeScreen: undefined; // HomeScreen no necesita parámetros
    RegisterScreen : undefined;
    Login:undefined; 
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

        </Stack.Navigator>
    );


}

