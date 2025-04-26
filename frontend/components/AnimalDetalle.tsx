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



export default function AnimalDetalle({ route }: any) {
  const { id } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const normalizarEstado = (estado: string): "en adopcion" | "reservado" | "adoptado" => {
    const limpio = estado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
          console.log(data);
  
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
    }, [id])  // <- importante pasar [id]
  );
  

  if (loading || !animal) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  const sexoFormateado = animal.sexo.toLowerCase() === "macho" ? "Macho" : "Hembra";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Image source={{ uri: animal.foto }} style={styles.image} />

      <Text style={styles.name}>{animal.nombre}</Text>

      <View style={styles.detailGroup}>
        <Text style={styles.label}>Sexo: <Text style={styles.value}>{sexoFormateado}</Text></Text>
        <Text style={styles.label}>Tipo de Animal: <Text style={styles.value}>{animal.tipoAnimal}</Text></Text>
        <Text style={styles.label}>
          Estado de Adopción:{" "}
          {animal.estado ? (
  <Text style={[styles.badge, getEstadoStyle(animal.estado)]}>
    {animal.estado.toUpperCase()}
  </Text>
) : (
  <Text style={[styles.badge, styles.enAdopcion]}>
    ESTADO DESCONOCIDO
  </Text>
)}

        </Text>
        <Text style={styles.label}>Esterilizado: <Text style={styles.value}>{animal.esterilizado ? "Sí" : "No"}</Text></Text>
        <Text style={styles.label}>Especie: <Text style={styles.value}>{animal.especie}</Text></Text>
        <Text style={styles.label}>Raza: <Text style={styles.value}>{animal.tipoRaza}</Text></Text>
        <Text style={styles.label}>Peso: <Text style={styles.value}>{animal.peso}</Text></Text>
        <Text style={styles.label}>Fecha de Nacimiento: <Text style={styles.value}>{formatoFecha (animal.fechaNacimiento)}</Text></Text>
        <Text style={styles.label}>Fecha de Ingreso: <Text style={styles.value}>{formatoFecha (animal.fechaIngreso)}</Text></Text>
      </View>

      <Text style={styles.descriptionTitle}>Descripción:</Text>
      <Text style={styles.description}>{animal.descripcion}</Text>

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

const getEstadoStyle = (estado: string) => {
  if (estado === "adoptado") return styles.adoptado;
  if (estado === "reservado") return styles.reservado;
  return styles.enAdopcion;
};

// 🔽 Tus estilos se mantienen igual:
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#D35400",
    marginBottom: 14,
    textAlign: "center",
  },
  detailGroup: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 15.5,
    fontWeight: "600",
    color: "#6E2C00",
    marginTop: 8,
  },
  value: {
    fontWeight: "normal",
    color: "#333",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
    fontWeight: "bold",
    fontSize: 13,
  },
  adoptado: {
    backgroundColor: "#d1c4e9",
    color: "#5e35b1",
  },
  reservado: {
    backgroundColor: "#ffe082",
    color: "#ef6c00",
  },
  enAdopcion: {
    backgroundColor: "#c8e6c9",
    color: "#2e7d32",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 22,
    marginBottom: 4,
    color: "#A04000",
  },
  description: {
    fontSize: 15,
    color: "#5D6D7E",
    lineHeight: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 4,
    elevation: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#002aa1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ef3d13",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
