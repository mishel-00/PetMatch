//En esta pantalla salen ya todos los datos del animal especifico que ha pinchado anteiiroemnte el adoptante y abajo sale un boton
// donde podra le saldran los diferemntes hoarios  disponibles para que pida cita
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getxxx } from "@/service/api";
import { formatoFecha } from "@/utils/formatoFecha";

interface Animal {
  id: string;
  nombre: string;
  sexo: string;
  especie: string;
  tipoRaza: string;
  peso: string;
  estado: string;
  descripcion: string;
  esterilizado: boolean;
  fechaNacimiento: string;
  fechaIngreso: string;
  foto: string;
}

export default function AnimalDetalleAdoptante({ route }: any) {
  const { id } = route.params;
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const data = await getxxx(`api/animal/${id}`);
        setAnimal({
          ...data,
          estado: data.estadoAdopcion,
          fechaNacimiento: data.fecha_nacimiento,
          fechaIngreso: data.fecha_ingreso,
        });
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el animal.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  if (loading || !animal) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  const sexoFormateado = animal.sexo.toLowerCase() === "macho" ? "Macho" : "Hembra";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Image source={{ uri: animal.foto }} style={styles.image} />

      <Text style={styles.name}>{animal.nombre}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Sexo: <Text style={styles.value}>{sexoFormateado}</Text></Text>
        <Text style={styles.label}>Especie: <Text style={styles.value}>{animal.especie}</Text></Text>
        <Text style={styles.label}>Raza: <Text style={styles.value}>{animal.tipoRaza}</Text></Text>
        <Text style={styles.label}>Peso: <Text style={styles.value}>{animal.peso}</Text></Text>
        <Text style={styles.label}>Estado: <Text style={[styles.estado, getEstadoColor(animal.estado)]}>{animal.estado.toUpperCase()}</Text></Text>
        <Text style={styles.label}>Esterilizado: <Text style={styles.value}>{animal.esterilizado ? "Sí" : "No"}</Text></Text>
        <Text style={styles.label}>Nacimiento: <Text style={styles.value}>{formatoFecha(animal.fechaNacimiento)}</Text></Text>
        <Text style={styles.label}>Ingreso: <Text style={styles.value}>{formatoFecha(animal.fechaIngreso)}</Text></Text>
      </View>

      <Text style={styles.descriptionTitle}>Descripción:</Text>
      <Text style={styles.description}>{animal.descripcion}</Text>
    </ScrollView>
  );
}

const getEstadoColor = (estado: string) => {
  if (estado === "adoptado") return styles.adoptado;
  if (estado === "reservado") return styles.reservado;
  return styles.enAdopcion;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5E6", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 220, borderRadius: 12, marginBottom: 16 },
  name: { fontSize: 26, fontWeight: "bold", color: "#D35400", textAlign: "center", marginBottom: 14 },
  infoBox: { backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 2 },
  label: { fontSize: 15, fontWeight: "600", color: "#6E2C00", marginTop: 10 },
  value: { fontWeight: "normal", color: "#333" },
  estado: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "bold",
    fontSize: 13,
    overflow: "hidden",
  },
  adoptado: { backgroundColor: "#d1c4e9", color: "#5e35b1" },
  reservado: { backgroundColor: "#ffe082", color: "#ef6c00" },
  enAdopcion: { backgroundColor: "#c8e6c9", color: "#2e7d32" },
  descriptionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, color: "#A04000" },
  description: { fontSize: 15, color: "#5D6D7E", lineHeight: 20, backgroundColor: "#fff", padding: 12, borderRadius: 10, marginTop: 4, elevation: 1 },
});
