import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useAuthStore } from "../store/authStore";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function DrawerContent(props: DrawerContentComponentProps) {
  const { username: email, isActive, logout, isAuthenticated, rol } = useAuthStore();
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>

      <View style={styles.userInfo}>
        <Text style={styles.email}>{email || "Invitado"}</Text>
        <Text style={styles.status}>
          Estado:{" "}
          <Text style={{ color: isActive ? "green" : "red" }}>
            {isActive ? "Activo" : "Inactivo"}
          </Text>
        </Text>
      </View>

      {/* Botón para iniciar sesión si no está autenticado */}
      {!isAuthenticated && (
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      )}

      {/* Botón para cerrar sesión si está autenticado */}
      {isAuthenticated && (
        <TouchableOpacity
          onPress={() => {
            logout();
            navigation.navigate("Login");
          }}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      )}

      {/* Sección de gestión visible solo para asociaciones */}
      {isAuthenticated && rol === "asociacion" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ListaAnimales")}
            style={[styles.menuButton, { backgroundColor: "#FFA726" }]}
          >
            <Text style={styles.menuButtonText}>🐾 Animales</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("HorarioDisponible")}
            style={[styles.menuButton, { backgroundColor: "#4CAF50" }]}
          >
       <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
    <Icon name="calendar-month" size={20} color="#fff" style={{ marginRight: 8 }} />
    <Text style={styles.menuButtonText}>Horario Disponible</Text>
  </View>
  </TouchableOpacity>
  <TouchableOpacity
  style={{
    backgroundColor: "#1abc9c",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  }}
  onPress={() => navigation.navigate("ListaCitasAsociacion")}
>
  <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
    📅 Citas
  </Text>
</TouchableOpacity>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 16,
    marginTop: 5,
  },
  loginButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 8,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e53935",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#A67C52",
  },
  menuButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%"
  },
  menuButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
