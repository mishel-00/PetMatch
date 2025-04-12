import React from "react";
import LoginScreen from "./login";
import DrawerContent from "@/components/DrawerContent";
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import TabsNavigator from "./(tabs)/TabsNavigator";


const Drawer = createDrawerNavigator();

export default function Layout() {
    return (
        <Drawer.Navigator
            drawerContent={(props: React.JSX.IntrinsicAttributes & DrawerContentComponentProps) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: true, // Muestra el encabezado
                headerTitleAlign: "center", // Alinea el título en el centro
                headerStyle: {
                    backgroundColor: "#fff",
                },
                headerTintColor: "#000", // Color del texto del encabezado
            }}
        >
            <Drawer.Screen name="Home" component={TabsNavigator} options={{ headerTitle: "Home" }} />
            <Drawer.Screen name="Login" component={LoginScreen} options={{ headerTitle: "Iniciar Sesión" }} />
        </Drawer.Navigator>



    );
}










