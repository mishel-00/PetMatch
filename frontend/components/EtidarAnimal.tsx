import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/app/(tabs)/HomeStack"; // ajusta según tu estructura
import { updateAnimal } from "@/service/api";
import { Picker } from "@react-native-picker/picker";


type EditarAnimalRouteProp = RouteProp<RootStackParamList, "EditarAnimal">;

interface Props {
  route: EditarAnimalRouteProp;
}

export default function EditarAnimal({ route }: Props) {
  const { animal } = route.params;
  const navigation = useNavigation();

  const [nombre, setNombre] = useState(animal.nombre);
  const [descripcion, setDescripcion] = useState(animal.descripcion);
  const [peso, setPeso] = useState(animal.peso);
  const [estado, setEstado] = useState(animal.estado);

  const handleSave = async () => {
    try {
      await updateAnimal(animal.id, { nombre, descripcion, peso, estado });
      Alert.alert("Éxito", "El animal fue actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el animal.");
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Animal</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre" />
      <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} placeholder="Descripción" />
      <TextInput style={styles.input} value={peso} onChangeText={setPeso} placeholder="Peso" />
      <Picker
  selectedValue={estado}
  onValueChange={(itemValue) =>
    setEstado(itemValue as "en adopcion" | "reservado" | "adoptado")
}
  style={styles.input}
>
  <Picker.Item label="En adopción" value="en adopcion" />
  <Picker.Item label="Reservado" value="reservado" />
  <Picker.Item label="Adoptado" value="adoptado" />
</Picker>

      <Button title="Guardar Cambios" onPress={handleSave} color="#D35400" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF5E6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#D35400",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D35400",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
