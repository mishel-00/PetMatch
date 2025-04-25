import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuthStore } from "@/store/authStore";
import { getxxx } from "@/service/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/(tabs)/HomeStack";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


interface Animal {
  id: string;
  foto: string;
  nombre: string;
  descripcion: string;
  sexo: string;
  especie: string;
  tipoRaza: string;
  tipoAnimal: string;
  peso: string;
  estado: "en adopcion" | "reservado" | "adoptado";
  esterilizado: boolean;
  fechaNacimiento: string;
  fechaIngreso: string;
}

export default function ListaAnimales() {
  const { userId } = useAuthStore();
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      const fetchAnimales = async () => {
        try {
          setLoading(true);
          const data = await getxxx("api/animal");
          const mapped = data.map((item: any) => ({
            id: item.id,
            foto: item.foto,
            nombre: item.nombre,
            descripcion: item.descripcion,
            sexo: item.sexo,
            especie: item.especie,
            tipoRaza: item.tipoRaza,
            tipoAnimal: item.especie,
            peso: item.peso,
            estado: item.estadoAdopcion,
            esterilizado: item.esterilizado,
            fechaNacimiento: item.fecha_nacimiento,
            fechaIngreso: item.fecha_ingreso,
          }));
          setAnimales(mapped);
        } catch (error: any) {
          Alert.alert("Error", `Error al cargar animales: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAnimales();
    }, [userId])
  );
  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Listado de Animales</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CrearAnimal")}
        >
          <Text style={styles.createButtonText}>➕ Crear</Text>
        </TouchableOpacity>
      </View>

      {animales.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📭 Aún no tienes animales registrados.</Text>
        </View>
      ) : (
        <FlatList
          data={animales}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const sexoFormateado = item.sexo === "macho" ? "Macho" : "Hembra";

            return (
              <TouchableOpacity onPress={() => navigation.navigate("AnimalDetalle", { id: item.id })}>
                <View style={styles.card}>
                  <Image source={{ uri: item.foto }} style={styles.image} />
                  <Text style={styles.name}>{item.nombre}</Text>

                  <Text style={styles.detail}>⚧ Sexo: <Text style={styles.bold}>{sexoFormateado}</Text></Text>
                  <Text style={styles.detail}>🐾 Especie: <Text style={styles.bold}>{item.especie}</Text></Text>
                  <Text style={styles.detail}>📅 Ingreso: <Text style={styles.ingreso}>{item.fechaIngreso}</Text></Text>

                  <Text
                    style={[
                      styles.estado,
                      item.estado === "adoptado"
                        ? styles.adoptado
                        : item.estado === "reservado"
                        ? styles.reservado
                        : styles.enAdopcion,
                    ]}
                  >
                    {item.estado.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#A67C52",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D35400",
  },
  createButton: {
    backgroundColor: "#D35400",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D35400",
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  bold: {
    fontWeight: "600",
    color: "#000",
  },
  ingreso: {
    fontWeight: "600",
    color: "#5D6D7E",
  },
  estado: {
    marginTop: 10,
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignSelf: "flex-start",
    overflow: "hidden",
    fontSize: 12,
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
});
