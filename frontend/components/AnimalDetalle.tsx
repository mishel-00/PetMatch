import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

export default function AnimalDetalle({ route }: any) {
  const { animal } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Image source={{ uri: animal.foto }} style={styles.image} />

      <Text style={styles.name}>{animal.nombre}</Text>
      <Text style={styles.label}>Sexo: <Text style={styles.value}>{animal.sexo}</Text></Text>
      <Text style={styles.label}>Tipo de Animal: <Text style={styles.value}>{animal.tipoAnimal}</Text></Text>
      <Text style={styles.label}>Estado de Adopción: <Text style={[styles.value, getEstadoStyle(animal.estado)]}>{animal.estado}</Text></Text>
      <Text style={styles.label}>Esterilizado: <Text style={styles.value}>{animal.esterilizado ? "Sí" : "No"}</Text></Text>
      <Text style={styles.label}>Especie: <Text style={styles.value}>{animal.especie}</Text></Text>
      <Text style={styles.label}>Raza: <Text style={styles.value}>{animal.tipoRaza}</Text></Text>
      <Text style={styles.label}>Peso: <Text style={styles.value}>{animal.peso} kg</Text></Text>
      <Text style={styles.label}>Fecha de Nacimiento: <Text style={styles.value}>{animal.fechaNacimiento}</Text></Text>
      <Text style={styles.label}>Fecha de Ingreso: <Text style={styles.value}>{animal.fechaIngreso}</Text></Text>

      <Text style={styles.descriptionTitle}>Descripción:</Text>
      <Text style={styles.description}>{animal.descripcion}</Text>
    </ScrollView>
  );
}

const getEstadoStyle = (estado: string) => {
  if (estado === "adoptado") return styles.adoptado;
  if (estado === "reservado") return styles.reservado;
  return styles.enAdopcion;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D35400",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6E2C00",
    marginTop: 6,
  },
  value: {
    fontWeight: "normal",
    color: "#333",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#A04000",
  },
  description: {
    fontSize: 15,
    color: "#5D6D7E",
    marginTop: 5,
    lineHeight: 20,
  },
  adoptado: {
    color: "green",
  },
  reservado: {
    color: "orange",
  },
  enAdopcion: {
    color: "red",
  },
});
