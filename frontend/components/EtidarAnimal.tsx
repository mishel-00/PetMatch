import React, { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Platform, TextInput } from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/app/(tabs)/HomeStack";
import { getxxx, updateAnimal } from "@/service/api";
import { uploadImageToFirebase } from "@/config/firebaseStorage";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import uuid from "react-native-uuid";

type EditarAnimalRouteProp = RouteProp<RootStackParamList, "EditarAnimal">;

interface Props {
  route: EditarAnimalRouteProp;
}

export default function EditarAnimal({ route }: Props) {
  const { id } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
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

  const [showNacimientoPicker, setShowNacimientoPicker] = useState(false);
  const [showIngresoPicker, setShowIngresoPicker] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const data = await getxxx(`api/animal/${id}`);
        const sexoFormateado = data.sexo?.toLowerCase() === "macho" ? "Macho" : "Hembra"
        setForm({
          foto: data.foto,
          nombre: data.nombre,
          sexo: sexoFormateado,
          tipoAnimal: data.especie,
          estado: data.estadoAdopcion?.toLowerCase() || "en adopcion",
          descripcion: data.descripcion,
          esterilizado: data.esterilizado,
          especie: data.especie,
          tipoRaza: data.tipoRaza,
          peso: data.peso,
          fechaNacimiento: data.fecha_nacimiento,
          fechaIngreso: data.fecha_ingreso,
        });
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el animal");
      } finally {
        setLoading(false);
      }
    };
    fetchAnimal();
  }, [id]);

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

  const handleDateChange = (event: any, selectedDate: Date | undefined, field: "fechaNacimiento" | "fechaIngreso") => {
    if (selectedDate) {
      const iso = selectedDate.toISOString().split("T")[0];
      handleChange(field, iso);
    }
    if (Platform.OS === "android") {
      if (field === "fechaNacimiento") setShowNacimientoPicker(false);
      if (field === "fechaIngreso") setShowIngresoPicker(false);
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = form.foto;
      if (form.foto.startsWith("file")) {
        const nombreArchivo = `animal_${uuid.v4()}.jpg`;
        imageUrl = await uploadImageToFirebase(form.foto, nombreArchivo);
      }

      await updateAnimal(id, {
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
      });

      Alert.alert("Éxito", "Animal actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el animal");
      console.error(error);
    }
  };

  const pesoPerro = ["Miniatura (1-6 kg)", "Pequeña (5-25 kg)", "Mediana (14-27 kg)", "Grande (21-39 kg)", "Gigante (34-82 kg)"];
  const pesoGato = ["Junior (<3.5 kg)", "Adulto (3.5-5.5 kg)", "Grande (>5.5 kg)"];

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Animal</Text>

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
        { label: "Tipo de Raza", field: "tipoRaza" },
      ].map((input) => (
        <TextInput
          key={input.field}
          placeholder={input.label}
          value={form[input.field as keyof typeof form] as string}
          onChangeText={(text) => handleChange(input.field, text)}
          style={styles.input}
        />
      ))}

      <TouchableOpacity style={styles.input} onPress={() => setShowNacimientoPicker(true)}>
        <Text>{form.fechaNacimiento || "📅 Fecha de Nacimiento"}</Text>
      </TouchableOpacity>
      {showNacimientoPicker && (
        <DateTimePicker value={new Date(form.fechaNacimiento)} mode="date" display="default" onChange={(e, date) => handleDateChange(e, date, "fechaNacimiento")} />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowIngresoPicker(true)}>
        <Text>{form.fechaIngreso || "📅 Fecha de Ingreso"}</Text>
      </TouchableOpacity>
      {showIngresoPicker && (
        <DateTimePicker value={new Date(form.fechaIngreso)} mode="date" display="default" onChange={(e, date) => handleDateChange(e, date, "fechaIngreso")} />
      )}

      <Picker selectedValue={form.sexo} onValueChange={(value) => handleChange("sexo", value)} style={styles.picker}>
        <Picker.Item label="Sexo" value="" />
        <Picker.Item label="Hembra" value="Hembra" />
        <Picker.Item label="Macho" value="Macho" />
      </Picker>

      <Picker selectedValue={form.tipoAnimal} onValueChange={(value) => handleChange("tipoAnimal", value)} style={styles.picker}>
        <Picker.Item label="Tipo de Animal" value="" />
        <Picker.Item label="Perro" value="perro" />
        <Picker.Item label="Gato" value="gato" />
      </Picker>

      <Picker selectedValue={form.estado} onValueChange={(value) => handleChange("estado", value)} style={styles.picker}>
        <Picker.Item label="En adopción" value="en adopcion" />
        <Picker.Item label="Reservado" value="reservado" />
        <Picker.Item label="Adoptado" value="adoptado" />
      </Picker>

      <Picker selectedValue={form.peso} onValueChange={(value) => handleChange("peso", value)} style={styles.picker}>
        <Picker.Item label="Seleccione Peso" value="" />
        {(form.tipoAnimal === "perro" ? pesoPerro : pesoGato).map((p) => (
          <Picker.Item key={p} label={p} value={p} />
        ))}
      </Picker>

      <TouchableOpacity
        style={[styles.checkbox, form.esterilizado && styles.checked]}
        onPress={() => handleChange("esterilizado", !form.esterilizado)}
      >
        <Text style={styles.checkboxText}>{form.esterilizado ? "☑ Esterilizado" : "☐ Esterilizado"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20, backgroundColor: "#FFF5E6", flexGrow: 1 },
  title: { fontSize: 24, fontWeight: "bold", color: "#D35400", textAlign: "center", marginBottom: 20 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: "#ccc" },
  picker: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: "#ccc" },
  checkbox: { marginBottom: 20, padding: 10 },
  checked: { backgroundColor: "#d0f0c0" },
  checkboxText: { fontSize: 16, color: "#333" },
  button: { backgroundColor: "#D35400", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  imagePicker: {
    backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#ccc",
    padding: 16, alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  imagePickerText: { color: "#666" },
  imagePreview: { width: 200, height: 200, borderRadius: 10 },
});
