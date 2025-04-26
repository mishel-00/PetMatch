import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { getxxx } from "@/service/api";

export default function HomeAsociacion() {
  const [animalesCount, setAnimalesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        setLoading(true);
        const data = await getxxx("api/animal"); 
        setAnimalesCount(data.length); 
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la información de animales.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimales();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>🐾 PetMatch</Text>
      </View>

      
      {/* Estadísticas */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Tus estadísticas</Text>

        <View style={styles.statRow}>
          <Text style={styles.statEmoji}>🐶</Text>
          <Text style={styles.statText}>Animales publicados: <Text style={styles.bold}>{animalesCount}</Text></Text>
        </View>

        {/* Aquí luego agregarás citas, solicitudes y adopciones */}
      </View>

      <Text style={styles.footerMessage}>
        "¡Sigamos encontrando hogares para más peluditos! 🏡"
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5E6",
  },
  container: {
    padding: 20,
    backgroundColor: "#FFF5E6",
    flexGrow: 1,
    alignItems: "center",
  },
  banner: {
    backgroundColor: "#D35400",
    width: "100%",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  bannerText: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },
  welcomeContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D35400",
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#A67C52",
  },
  statsCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#D35400",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  statText: {
    fontSize: 16,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  footerMessage: {
    textAlign: "center",
    fontSize: 15,
    color: "#A67C52",
    paddingHorizontal: 10,
    marginTop: 10,
  },
});
