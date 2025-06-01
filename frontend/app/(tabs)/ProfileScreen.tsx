import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { getxxx } from "@/service/api";

interface HistorialItem {
  animal_id: string;
  nombre_animal: string;
  fecha_adopcion: string;
  asociacion: string;
}

export default function ProfileScreen() {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await getxxx("api/adoptante/historial");
        setHistorial(data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, []);

  if (loading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}> Tus Mascotas</Text>
      {historial.length === 0 ? (
        <Text style={styles.empty}>Aún no has adoptado ningún animal.</Text>
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.animal_id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.nombre_animal}</Text>
              <Text style={styles.info}>📅 {item.fecha_adopcion}</Text>
              <Text style={styles.info}>🏠 Asociación: {item.asociacion}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF5E6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D35400",
    textAlign: "center",
    marginBottom: 20,
  },
  empty: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});
  