//Pantalla de asociacion donde aqui podra crear un animal con todos sus datos para posterirormente publicarlo y poder editarlo tambien
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
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { postxxx } from "@/service/api";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToFirebase } from "@/config/firebaseStorage";
import uuid from "react-native-uuid";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth } from "@/config/firebaseConfig";

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
  const [errores, setErrores] = useState<{ [key: string]: boolean }>({});
  const [showNacimientoPicker, setShowNacimientoPicker] = useState(false);
  const [showIngresoPicker, setShowIngresoPicker] = useState(false);

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

  const resetForm = () => {
    setForm({
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
    setErrores({});
  };

  const validarCampos = () => {
    const camposRequeridos = [
      "foto",
      "nombre",
      "sexo",
      "tipoAnimal",
      "descripcion",
      "tipoRaza",
      "peso",
      "fechaNacimiento",
      "fechaIngreso"
    ];

    const nuevosErrores: { [key: string]: boolean } = {};
    camposRequeridos.forEach((campo) => {
      if (!form[campo as keyof typeof form]) {
        nuevosErrores[campo] = true;
      }
    });

    // Validar que fechaIngreso no sea mayor a la fecha actual
    if (form.fechaIngreso) {
      const hoy = new Date().toISOString().split("T")[0];
      if (form.fechaIngreso > hoy) {
        nuevosErrores["fechaIngreso"] = true;
        Alert.alert("Fecha inválida", "La fecha de ingreso no puede ser posterior a hoy.");
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      handleChange("foto", uri);
    }
  };

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    field: "fechaNacimiento" | "fechaIngreso"
  ) => {
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split("T")[0];
      handleChange(field, isoDate);
    }
    if (Platform.OS === "android") {
      if (field === "fechaNacimiento") setShowNacimientoPicker(false);
      if (field === "fechaIngreso") setShowIngresoPicker(false);
    }
  };

  const handleSubmit = async () => {
    if (!validarCampos()) {
      Alert.alert("Faltan campos por rellenar", "Por favor completa los campos obligatorios.");
      return;
    }

    try {
      if (!auth.currentUser) {
        Alert.alert("Error", "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
        return;
      }

      const nombreArchivo = `animal_${uuid.v4()}.jpg`;
      const imageUrl = await uploadImageToFirebase(form.foto, nombreArchivo);

      const datosFinales = {
        foto: imageUrl,
        nombre: form.nombre,
        descripcion: form.descripcion,
        estadoAdopcion: form.estado,
        esterilizado: form.esterilizado,
        especie: form.tipoAnimal,
        tipoRaza: form.tipoRaza,
        peso: form.peso,
        fecha_nacimiento: form.fechaNacimiento,
        fecha_ingreso: form.fechaIngreso,
        sexo: form.sexo,
        asociacion_id: auth.currentUser?.uid
      };

      await postxxx("api/animal", datosFinales);

      Alert.alert("Éxito", "Animal creado exitosamente");
      resetForm();
      navigation.navigate("ListaAnimales" as never);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el animal");
      console.error("Error al crear animal:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Animal</Text>

      <TouchableOpacity onPress={seleccionarImagen} style={[styles.imagePicker, errores["foto"] && { borderColor: "red", borderWidth: 2 }]}>
        {form.foto ? (
          <Image source={{ uri: form.foto }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>📸 Seleccionar imagen</Text>
        )}
      </TouchableOpacity>

      {["nombre", "descripcion", "tipoRaza"].map((campo) => (
        <TextInput
          key={campo}
          placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
          value={form[campo as keyof typeof form] as string}
          onChangeText={(text) => handleChange(campo, text)}
          style={[styles.input, errores[campo] && { borderColor: "red", borderWidth: 2 }]}
        />
      ))}

      <TouchableOpacity
        style={[styles.input, errores["fechaNacimiento"] && { borderColor: "red", borderWidth: 2 }]}
        onPress={() => setShowNacimientoPicker(true)}
      >
        <Text>{form.fechaNacimiento || "📅 Fecha de Nacimiento"}</Text>
      </TouchableOpacity>
      {showNacimientoPicker && (
        <DateTimePicker
          value={form.fechaNacimiento ? new Date(form.fechaNacimiento) : new Date()}
          mode="date"
          display="default"
          onChange={(e, date) => handleDateChange(e, date, "fechaNacimiento")}
        />
      )}

      <TouchableOpacity
        style={[styles.input, errores["fechaIngreso"] && { borderColor: "red", borderWidth: 2 }]}
        onPress={() => setShowIngresoPicker(true)}
      >
        <Text>{form.fechaIngreso || "📅 Fecha de Ingreso"}</Text>
      </TouchableOpacity>
      {showIngresoPicker && (
        <DateTimePicker
          value={form.fechaIngreso ? new Date(form.fechaIngreso) : new Date()}
          mode="date"
          display="default"
          onChange={(e, date) => handleDateChange(e, date, "fechaIngreso")}
        />
      )}

      {["sexo", "tipoAnimal", "estado", "peso"].map((campo) => {
        let opciones: string[] = [];

        if (campo === "sexo") opciones = ["Hembra", "Macho"];
        else if (campo === "tipoAnimal") opciones = ["perro", "gato"];
        else if (campo === "estado") opciones = ["en adopcion", "reservado", "adoptado"];
        else if (campo === "peso") opciones = form.tipoAnimal === "perro" ? pesoPerro : pesoGato;

        return (
          <Picker
            key={campo}
            selectedValue={form[campo as keyof typeof form] as string}
            onValueChange={(value) => handleChange(campo, value)}
            style={[styles.picker, errores[campo] && { borderColor: "red", borderWidth: 2 }]}
          >
            <Picker.Item label={campo === "estado" ? "Estado" : `Seleccione ${campo}`} value="" />
            {opciones.map((op) => (
              <Picker.Item key={op} label={op} value={op} />
            ))}
          </Picker>
        );
      })}

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
