import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useAuthStore } from "../store/authStore";
import { Feather } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { notificationService } from "@/hooks/NotificationService ";



export default function LoginScreen({ navigation }: any) {
  const { username: savedEmail, password: savedPassword, login } = useAuthStore();
  const [email, setEmail] = useState(savedEmail || "");
  const [password, setPassword] = useState(savedPassword || "");
  const [showPassword, setShowPassword] = useState(false);


  // const handleLogin = async () => {
  //   try {
  //     const rol = await login(email, password);
  //     if (rol === "adoptante") {
  //       navigation.navigate("HomeAdoptante");
  //     } else if (rol === "asociacion") {
  //       navigation.navigate("HomeAsociacion");
  //     } else {
  //       Alert.alert( "Correo o contraseña incorrectos");
  //     }
  //   } catch (error) {
  //     Alert.alert( "Algo salió mal al iniciar sesión.");
  //   }
  // };

  //Para las notificaciones
  const handleLogin = async () => {
    try {
      const rol = await login(email, password);
  
      const userId = getAuth().currentUser?.uid;
  
      if (userId) {
        await notificationService.registerDevice(userId);
      }
  
      if (rol === "adoptante") {
        navigation.navigate("HomeAdoptante");
      } else if (rol === "asociacion") {
        navigation.navigate("HomeAsociacion");
      } else {
        Alert.alert("Correo o contraseña incorrectos");
      }
    } catch (error) {
      Alert.alert("Algo salió mal al iniciar sesión.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/Logo_petMatch_con_letras.png")} style={styles.logo} resizeMode="contain" />

      <View style={styles.inputContainer}>
        <Feather name="mail" size={20} style={styles.iconBlue} />
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
  <Feather name="lock" size={20} style={styles.iconBlue} />
  <TextInput
    style={[styles.input, { paddingRight: 40 }]}
    placeholder="Contraseña"
    placeholderTextColor="#A67C52"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
  />
  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
    style={styles.eyeIcon}
  >
    <Feather
      name={showPassword ? "eye" : "eye-off"}
      size={20}
      color="#002aa1"
    />
  </TouchableOpacity>
</View>


      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
        <Feather name="arrow-right" size={20} style={styles.buttonIcon} />
      </TouchableOpacity>

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
  logo: {
    width: 260,
    height: 260,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#002aa1", // Azul intenso
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBlue: {
    color: "#002aa1",
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
    backgroundColor: "#ef3d13", // Naranja Pet Match
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
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  
});
