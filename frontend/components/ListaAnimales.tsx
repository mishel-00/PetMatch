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

interface Animal {
  id: string;
  foto: string;
  nombre: string;
  sexo: string;
  tipoAnimal: string;
  estado: "en adopcion" | "reservado" | "adoptado";
}

export default function ListaAnimales() {
  const { userId } = useAuthStore();
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        const data = await getxxx("api/animal");
        const mapped = data.map((item: any) => ({
          id: item.id,
          foto: item.foto,
          nombre: item.nombre,
          descripcion: item.descripcion,
          sexo: item.sexo,
          especie: item.especie,
          tipoRaza: item.tipoRaza,
          tipoAnimal: item.especie, // por compatibilidad
          peso: item.peso,
          estado: item.estadoAdopcion, // por compatibilidad
          esterilizado: item.esterilizado,
          fechaNacimiento: item.fecha_nacimiento,
          fechaIngreso: item.fecha_ingreso,
        }));
        
setAnimales(mapped);

      } catch (error: any) {
        Alert.alert("Error", `Error al cargar animales: ${error.message}`);
        console.error("Error al cargar animales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimales();
  }, [userId]);

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
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("AnimalDetalle", { animal: item })}>
              <View style={styles.card}>
                <Image source={{ uri: item.foto }} style={styles.image} />
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.detail}>⚧️ Sexo: {item.sexo}</Text>
                <Text style={styles.detail}>🐾 Tipo: {item.tipoAnimal}</Text>
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
          )}
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
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D35400",
    textAlign: "center",
    marginVertical: 20,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#D35400",
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: "#333",
  },
  estado: {
    marginTop: 8,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 10,
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
  
});
