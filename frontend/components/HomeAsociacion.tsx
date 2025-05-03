//Pantalla principal de asociacion donde saldran las estadisticas e informacion de la asociacion 
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { getxxx } from "@/service/api";

export default function HomeAsociacion() {
  const [animalesCount, setAnimalesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [citasPendientes, setCitasPendientes] = useState<any[]>([]);


  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        setLoading(true);
        //Aqui pedimos los animales de la asocion y solo mostramos los la cantidad que tiene publicados
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

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);
  
        const animales = await getxxx("api/animal");
        setAnimalesCount(animales.length);
  
        const idAsociacion = "X_TU_ID_ASOCIACION_X"; // ← cámbialo dinámicamente según corresponda
        const citas = await getxxx(`api/citas/pendientes?asociacion_id=${idAsociacion}`);
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
        <View style={styles.statsCard}>
  <Text style={styles.statsTitle}>📊 Tus estadísticas</Text>

  <View style={styles.statRow}>
    <Text style={styles.statEmoji}>🐶</Text>
    <Text style={styles.statText}>Animales publicados: <Text style={styles.bold}>{animalesCount}</Text></Text>
  </View>

  <View style={styles.statRow}>
    <Text style={styles.statEmoji}>📅</Text>
    <Text style={styles.statText}>Citas pendientes: <Text style={styles.bold}>{citasPendientes.length}</Text></Text>
  </View>
</View>

{/* Lista breve de las próximas citas */}
{citasPendientes.length > 0 && (
  <View style={styles.statsCard}>
    <Text style={styles.statsTitle}>🕐 Próximas citas</Text>
    {citasPendientes.slice(0, 3).map((cita, index) => (
      <View key={index} style={styles.statRow}>
        <Text style={styles.statText}>
          {cita.fecha} {cita.hora}h – {cita.animal} con {cita.adoptante}
        </Text>
      </View>
    ))}
  </View>
)}

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
