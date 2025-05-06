import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getxxx } from "@/service/api";

interface Cita {
  fecha: string;
  hora: string;
  animal: { 
    nombre: string 
    especie: string;
  };
  adoptante: { nombre: string };

}

export default function HomeAsociacion() {
  const [animalesCount, setAnimalesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [citasPendientes, setCitasPendientes] = useState<Cita[]>([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);

        const animales = await getxxx("api/animal");
        setAnimalesCount(animales.length);

        let citas: Cita[] = await getxxx("api/citaPosible/aceptadas/asociacion");

        citas.sort((a, b) => {
          const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
          const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
          return fechaHoraA.getTime() - fechaHoraB.getTime();
        });

        setCitasPendientes(citas);
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
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
      <View style={styles.banner}>
        <Text style={styles.bannerText}>🐾 PetMatch</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Tus estadísticas</Text>

        <View style={styles.statRow}>
          <Text style={styles.statEmoji}>🐶</Text>
          <Text style={styles.statText}>
            Animales publicados: <Text style={styles.bold}>{animalesCount}</Text>
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statEmoji}>📅</Text>
          <Text style={styles.statText}>
            Citas pendientes: <Text style={styles.bold}>{citasPendientes.length}</Text>
          </Text>
        </View>
      </View>

      {citasPendientes.length > 0 && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>🕐 Próximas citas</Text>
          {citasPendientes.slice(0, 3).map((cita, index) => {
  const icono =
    cita.animal?.especie?.toLowerCase() === "perro"
      ? "🐶"
      : cita.animal?.especie?.toLowerCase() === "gato"
      ? "🐱"
      : "🐾";

  return (
    <View key={index} style={styles.statRow}>
      <Text style={styles.statText}>
        {icono} {cita.fecha} {cita.hora}h – {cita.animal?.nombre ?? "🐾"} con {cita.adoptante?.nombre ?? "👤"}
      </Text>
    </View>
  );
})}

        </View>
      )}

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
