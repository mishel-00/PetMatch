import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useAuthStore } from "@/store/authStore";
import HomeAdoptante from "@/components/HomeAdoptante";
import HomeAsociacion from "@/components/HomeAsociacion";

export default function HomeScreen() {
  const { isAuthenticated, rol } = useAuthStore();

  if (isAuthenticated && rol === "adoptante") {
    return <HomeAdoptante />;
  }

  if (isAuthenticated && rol === "asociacion") {
    return <HomeAsociacion />;
  }

  // Si no hay sesión iniciada o no hay rol, mostrar pantalla original
  return (
    <ImageBackground
      source={require("../../assets/images/pataAnimal.jpg")}
      style={styles.background}
      resizeMode="contain"
    >
      <View style={styles.overlay}>
        <View style={styles.ctiContainer}>
          <Text style={styles.headerText}>
            <Text style={styles.PETMATCH}>PETMATCH</Text>
          </Text>
        </View>
        {/* Aquí puedes mostrar botón de login o mensaje de bienvenida */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 12,
  },
  ctiContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  PETMATCH: {
    color: "orange",
  },
});
