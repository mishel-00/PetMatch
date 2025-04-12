import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
const Stack = createNativeStackNavigator<RootStackParamList>();


export type RootStackParamList = {
    HomeScreen: undefined; // HomeScreen no necesita parámetros
   
};

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
           

        </Stack.Navigator>
    );


}

