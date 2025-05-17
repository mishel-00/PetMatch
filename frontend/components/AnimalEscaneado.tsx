import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/app/(tabs)/HomeStack";

type Props = {
  route: RouteProp<RootStackParamList, "AnimalEscaneado">;
};

export default function AnimalEscaneado({ route }: Props) {
  const { animal, id: citaId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 Animal Escaneado</Text>
      <Text style={styles.label}>📄 ID de la cita: {citaId}</Text>
      <Text>ID del animal: {animal.id}</Text>
      <Text>Nombre: {animal.nombre}</Text>
      <Text>Especie: {animal.especie}</Text>
      <Text>Descripción: {animal.descripcion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
});
