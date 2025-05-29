import { RootStackParamList } from "@/app/(tabs)/HomeStack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { deleteAnimal, getxxx } from "@/service/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { Animal } from "@/types/types";
import { formatoFecha } from "@/utils/formatoFecha";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function AnimalDetalle({ route }: any) {
  const { id } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizarEstado = (estado: string): "en adopcion" | "reservado" | "adoptado" => {
    const limpio = estado.toLowerCase().normalize("NFD").replace(/\[\u0300-\u036f]/g, "");
    if (limpio === "adoptado") return "adoptado";
    if (limpio === "reservado") return "reservado";
    return "en adopcion";
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchAnimal = async () => {
        try {
          setLoading(true);
          const data = await getxxx(`api/animal/${id}`);
          setAnimal({
            ...data,
            estado: normalizarEstado(data.estadoAdopcion),
            fechaNacimiento: data.fecha_nacimiento,
            fechaIngreso: data.fecha_ingreso,
            tipoAnimal: data.especie,
          });
        } catch (error) {
          Alert.alert("Error", "No se pudo cargar el animal");
        } finally {
          setLoading(false);
        }
      };

      fetchAnimal();
    }, [id])
  );

  if (loading || !animal) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  const sexoFormateado =
  animal.sexo?.toLowerCase() === "macho"
    ? "Macho"
    : animal.sexo?.toLowerCase() === "hembra"
    ? "Hembra"
    : "Desconocido";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Image source={{ uri: animal.foto }} style={styles.image} />

      <Text style={styles.name}>{animal.nombre}</Text>

      <View style={styles.detailGroup}>
        <DetailRow icon={<Ionicons name="male" size={20} color="#D35400" />} label="Sexo" value={sexoFormateado} />
        <DetailRow icon={<Ionicons name="paw" size={20} color="#D35400" />} label="Tipo de Animal" value={animal.tipoAnimal} />
        <DetailRow icon={<Ionicons name="heart" size={20} color="#D35400" />} label="Estado de Adopción" value={animal.estado.toUpperCase()} badge />
        <DetailRow icon={<Ionicons name="medical" size={20} color="#D35400" />} label="Esterilizado" value={animal.esterilizado ? "Sí" : "No"} />
        <DetailRow icon={<Ionicons name="bug" size={20} color="#D35400" />} label="Especie" value={animal.especie} />
        <DetailRow icon={<Ionicons name="medal" size={20} color="#D35400" />} label="Raza" value={animal.tipoRaza} />
        <DetailRow icon={<MaterialCommunityIcons name="scale-bathroom" size={20} color="#D35400" />} label="Peso" value={animal.peso} />
        <DetailRow icon={<Ionicons name="calendar-outline" size={20} color="#D35400" />} label="Fecha de Nacimiento" value={formatoFecha(animal.fechaNacimiento)} />
        <DetailRow icon={<MaterialCommunityIcons name="calendar-check" size={20} color="#D35400" />} label="Fecha de Ingreso" value={formatoFecha(animal.fechaIngreso)} />
      </View>

      <Text style={styles.descriptionTitle}>Descripción:</Text>
      <View style={styles.descriptionContainer}>
        <Ionicons name="document-text-outline" size={20} color="#D35400" style={{ marginRight: 8 }} />
        <Text style={styles.description}>{animal.descripcion}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditarAnimal", { id: animal.id })}
        >
          <Text style={styles.buttonText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              "¿Eliminar Animal?",
              "¿Estás seguro de que quieres eliminar este animal?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Eliminar",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await deleteAnimal(animal.id);
                      Alert.alert("Éxito", "El animal fue eliminado.");
                      navigation.goBack();
                    } catch (error) {
                      Alert.alert("Error", "No se pudo eliminar el animal.");
                    }
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.buttonText}>🗑 Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function DetailRow({ icon, label, value, badge = false }: { icon: any; label: string; value: string; badge?: boolean }) {
  return (
    <View style={styles.detailRow}>
      {icon}
      <Text style={styles.label}>{label}:</Text>
      {badge ? (
        <Text style={[styles.badge, getEstadoStyle(value.toLowerCase())]}>{value}</Text>
      ) : (
        <Text style={styles.value}> {value}</Text>
      )}
    </View>
  );
}

const getEstadoStyle = (estado: string) => {
  if (estado === "adoptado") return styles.adoptado;
  if (estado === "reservado") return styles.reservado;
  return styles.enAdopcion;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5E6", padding: 16 },
  image: { width: "100%", height: 220, borderRadius: 12, marginBottom: 16 },
  name: { fontSize: 26, fontWeight: "bold", color: "#D35400", marginBottom: 14, textAlign: "center" },
  detailGroup: { padding: 10, borderRadius: 12, backgroundColor: "#fff", elevation: 2 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 6 },
  label: { fontSize: 15.5, fontWeight: "600", color: "#6E2C00" },
  value: { fontWeight: "normal", color: "#333" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, fontWeight: "bold", fontSize: 12, overflow: "hidden" },
  adoptado: { backgroundColor: "#d1c4e9", color: "#5e35b1" },
  reservado: { backgroundColor: "#ffe082", color: "#ef6c00" },
  enAdopcion: { backgroundColor: "#c8e6c9", color: "#2e7d32" },
  descriptionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 22, marginBottom: 4, color: "#A04000" },
  descriptionContainer: { flexDirection: "row", backgroundColor: "#fff", padding: 12, borderRadius: 10, elevation: 1, marginTop: 6, alignItems: "center" },
  description: { flex: 1, fontSize: 15, color: "#5D6D7E", lineHeight: 20 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 30, gap: 12 },
  editButton: { flex: 1, backgroundColor: "#002aa1", padding: 12, borderRadius: 8, alignItems: "center", elevation: 2 },
  deleteButton: { flex: 1, backgroundColor: "#ef3d13", padding: 12, borderRadius: 8, alignItems: "center", elevation: 2 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
