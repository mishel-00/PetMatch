import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { getxxx, postxxx } from "@/service/api";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";




export default function CrearAnimal() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    foto: "",
    nombre: "",
    sexo: "",
    tipoAnimal: "",
    estado: "en adopcion",
    descripcion: "",
    esterilizado: false,
    especie: "",
    tipoRaza: "",
    peso: "",
    fechaNacimiento: "",
    fechaIngreso: "",
  });

  const seleccionarImagen = async () => {
    // Pedir permiso
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita permiso para acceder a la galería.");
      return;
    }
  
    // Seleccionar imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      // Guardar URI temporal
      const uri = result.assets[0].uri;
      handleChange("foto", uri);
    }
  };
  

  const pesoPerro = [
    "Miniatura (1-6 kg)",
    "Pequeña (5-25 kg)",
    "Mediana (14-27 kg)",
    "Grande (21-39 kg)",
    "Gigante (34-82 kg)",
  ];

  const pesoGato = ["Junior (<3.5 kg)", "Adulto (3.5-5.5 kg)", "Grande (>5.5 kg)"];

  const handleChange = (field: string, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await postxxx("/api/animal", form);
      Alert.alert("Éxito", "Animal creado exitosamente");
      navigation.navigate("ListaAnimales" as never); // Regresa y refresca
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el animal");
      console.error("Error al crear animal:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Animal</Text>
 {/* 📸 Botón para seleccionar imagen */}
 <TouchableOpacity onPress={seleccionarImagen} style={styles.imagePicker}>
      {form.foto ? (
        <Image source={{ uri: form.foto }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.imagePickerText}>📸 Seleccionar imagen</Text>
      )}
    </TouchableOpacity>
      {[
        { label: "Nombre", field: "nombre" },
        { label: "Descripción", field: "descripcion" },
        { label: "Especie", field: "especie" },
        { label: "Tipo de Raza", field: "tipoRaza" },
        { label: "Fecha de Nacimiento (YYYY-MM-DD)", field: "fechaNacimiento" },
        { label: "Fecha de Ingreso (YYYY-MM-DD)", field: "fechaIngreso" },
      ].map((input) => (
        <TextInput
          key={input.field}
          placeholder={input.label}
          value={form[input.field as keyof typeof form] as string}
          onChangeText={(text) => handleChange(input.field, text)}
          style={styles.input}
        />
      ))}

      <Picker
        selectedValue={form.sexo}
        onValueChange={(value) => handleChange("sexo", value)}
        style={styles.picker}
      >
        <Picker.Item label="Sexo" value="" />
        <Picker.Item label="Hembra" value="Hembra" />
        <Picker.Item label="Macho" value="Macho" />
      </Picker>

      <Picker
        selectedValue={form.tipoAnimal}
        onValueChange={(value) => handleChange("tipoAnimal", value)}
        style={styles.picker}
      >
        <Picker.Item label="Tipo de Animal" value="" />
        <Picker.Item label="Perro" value="perro" />
        <Picker.Item label="Gato" value="gato" />
      </Picker>

      <Picker
        selectedValue={form.estado}
        onValueChange={(value) => handleChange("estado", value)}
        style={styles.picker}
      >
        <Picker.Item label="Estado" value="en adopcion" />
        <Picker.Item label="Reservado" value="reservado" />
        <Picker.Item label="Adoptado" value="adoptado" />
      </Picker>

      <Picker
        selectedValue={form.peso}
        onValueChange={(value) => handleChange("peso", value)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione Peso" value="" />
        {(form.tipoAnimal === "perro" ? pesoPerro : pesoGato).map((p) => (
          <Picker.Item key={p} label={p} value={p} />
        ))}
      </Picker>

      <TouchableOpacity
        style={[styles.checkbox, form.esterilizado && styles.checked]}
        onPress={() => handleChange("esterilizado", !form.esterilizado)}
      >
        <Text style={styles.checkboxText}>
          {form.esterilizado ? "☑ Esterilizado" : "☐ Esterilizado"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Crear</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF5E6",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D35400",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  checkbox: {
    marginBottom: 20,
    padding: 10,
  },
  checked: {
    backgroundColor: "#d0f0c0",
  },
  checkboxText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#D35400",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagePicker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  imagePickerText: {
    color: "#666",
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  
});
