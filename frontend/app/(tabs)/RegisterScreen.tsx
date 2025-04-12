import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";


export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"adoptante" | "asociacion" | "">("");

  const handleRegister = () => {
    if (!email || !password || !role) {
      Alert.alert("Por favor completa todos los campos");
      return;
    }

    // Aquí podrías enviar los datos a tu backend
    Alert.alert("Registro exitoso", `Rol: ${role}`);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>Regístrate en PetMach</Text>

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

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Soy:</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue as any)}
          style={styles.picker}
          dropdownIconColor="#D35400"
        >
          <Picker.Item label="Selecciona una opción" value="" color="#A67C52" />
          <Picker.Item label="Adoptante" value="adoptante" />
          <Picker.Item label="Asociación" value="asociacion" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
        <Feather name="user-plus" size={20} style={styles.buttonIcon} />
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
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#F0A500",
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 4 : 0,
  },
  pickerLabel: {
    color: "#A67C52",
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: "100%",
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
});
