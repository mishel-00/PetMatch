import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuthStore } from "../store/authStore";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen({ navigation }: any) {
  const { username: savedEmail, password: savedPassword, login,  } = useAuthStore();
  const [email, setEmail] = useState(savedEmail || "");
  const [password, setPassword] = useState(savedPassword || "");

  const handleLogin = async () => {
    try {
      const rol = await login(email, password); // rol es string o null
  
      if (rol === "adoptante") {
        navigation.navigate("HomeAdoptante");
      } else if (rol === "asociacion") {
        navigation.navigate("HomeAsociacion");
      } else {
        Alert.alert("Error", "Correo o contraseña incorrectos o rol no definido");
      }
    } catch (error) {
      Alert.alert("Error", "Algo salió mal al iniciar sesión.");
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <Text style={styles.subtitle}>Bienvenido a PetMach</Text>

      <View style={styles.inputContainer}>
        <Feather name="mail" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#A67C52"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather name="lock" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#A67C52"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
        <Feather name="arrow-right" size={20} style={styles.buttonIcon} />
      </TouchableOpacity>

      {/* Botón de registro */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
  <Text style={styles.registerText}>
    ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
  </Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#D35400",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#A67C52",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#F0A500",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    color: "#D35400",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D35400",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonIcon: {
    color: "#FFFFFF",
    marginLeft: 10,
  },
  registerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#A67C52",
  },
  registerLink: {
    color: "#D35400",
    fontWeight: "bold",
  },
});
