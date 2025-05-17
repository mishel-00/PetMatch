import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
 import { getxxx } from "@/service/api";
import { FontAwesome5 } from "@expo/vector-icons";
import { formatoFecha } from "@/utils/formatoFecha";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/app/(tabs)/HomeStack"; // Asegúrate de que esta ruta esté bien



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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();



  // Dentro del componente...
  useFocusEffect(
    useCallback(() => {
      const fetchDatos = async () => {
        try {
          setLoading(true);
  
          const animales = await getxxx("api/animal");
          setAnimalesCount(animales.length);
  
          let citas: Cita[] = await getxxx("api/citaPosible/aceptadas/asociacion");
  
          const ahora = new Date();
          citas = citas.filter((cita) => {
            const fechaHoraCita = new Date(`${cita.fecha}T${cita.hora}`);
            return fechaHoraCita.getTime() >= ahora.getTime();
          });
  
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
    }, [])
  );
  
  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      

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
          {citasPendientes.map((cita, index) => {
  const especie = cita.animal?.especie?.toLowerCase();
  const nombreAnimal = cita.animal?.nombre;
  const nombreAdoptante = cita.adoptante?.nombre;

  let iconName: any = "paw";
  let iconColor = "#555";

  if (especie === "perro") {
    iconName = "dog";
    iconColor = "#D35400";
  } else if (especie === "gato") {
    iconName = "cat";
    iconColor = "#8e44ad";
  }

  return (
    <TouchableOpacity
  key={index}
  style={styles.statRow}
  onPress={() => navigation.navigate("EscanearQR")}
>
  <FontAwesome5 name={iconName} size={20} color={iconColor} style={{ marginRight: 8 }} />
  <Text style={styles.statText}>
    {formatoFecha(cita.fecha)} {cita.hora}h – {nombreAnimal} con {nombreAdoptante}
  </Text>
</TouchableOpacity>

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
