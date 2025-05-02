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
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/(tabs)/HomeStack";
import { API_URL } from "@/service/api";

type Animal = {
  id: string;
  nombre: string;
  especie: string;
  foto?: string;
};

export default function AnimalesAsociacion({ route }: any) {
  const { asociacionId, nombre } = route.params;
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  console.log("id de la asociacion", asociacionId),

  useEffect(() => {
    const cargarAnimales = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) throw new Error("No autenticado");

        const token = await user.getIdToken();
        const response = await axios.get(`${API_URL}/api/obtenerAnimales/${asociacionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setAnimales(response.data);
      } catch (error) {
        console.error(" Error al obtener animales:", error);
        Alert.alert("Error", "No se pudieron cargar los animales.");
      } finally {
        setLoading(false);
      }
    };

    cargarAnimales();
  }, [asociacionId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animales de {nombre}</Text>
      <FlatList
        data={animales}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("AnimalDetalleAdopnate", { id: item.id })}>
            <View style={styles.card}>
              {item.foto && (
                <Image
                  source={{ uri: item.foto }}
                  style={{ width: "100%", height: 140, borderRadius: 8, marginBottom: 8 }}
                />
              )}
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.type}>Especie: {item.especie}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay animales aún 🐾</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5E6", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", color: "#D35400", marginBottom: 16 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  name: { fontSize: 16, fontWeight: "bold", color: "#2c3e50" },
  type: { fontSize: 14, color: "#555" },
  empty: { textAlign: "center", marginTop: 20, color: "#999" },
});
