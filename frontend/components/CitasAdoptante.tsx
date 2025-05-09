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
import { formatoFecha } from "@/utils/formatoFecha";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface Cita {
  id: string;
  asociacion_id: string;
  asociacion_nombre: string;
  nombreAnimal: string;
  especie: string;
  fecha: string;
  hora: string;
}

export default function Citas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data: Cita[] = await getxxx("api/citaPosible/aceptadas");
        console.log(data)
        data.sort((a, b) => {
          const fechaA = new Date(`${a.fecha}T${a.hora}`);
          const fechaB = new Date(`${b.fecha}T${b.hora}`);
          return fechaA.getTime() - fechaB.getTime();
        });
        setCitas(data);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar las citas.");
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  const renderIcon = (especie: string) => {
    if (especie.toLowerCase() === "perro") {
      return <FontAwesome5 name="dog" size={20} color="#D35400" />;
    } else if (especie.toLowerCase() === "gato") {
      return <FontAwesome5 name="cat" size={20} color="#8e44ad" />;
    } else {
      return <FontAwesome5 name="paw" size={20} color="#555" />;
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Citas</Text>
      {citas.map((cita) => (
        <TouchableOpacity
          key={cita.id}
          style={styles.card}
          //onPress={() => navigation.navigate("CitaDetalle", { citaId: cita.id })}
        >
          <View style={styles.cardHeader}>
            {renderIcon(cita.especie)}
            <Text style={styles.animalText}>{cita.nombreAnimal}</Text>
          </View>
          <Text style={styles.info}>📍 Asociación: {cita.asociacion_nombre}</Text>
          <Text style={styles.info}>📅 {formatoFecha(cita.fecha)} {cita.hora}h</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF5E6",
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5E6",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#D35400",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  animalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  info: {
    fontSize: 15,
    color: "#555",
    marginTop: 4,
  },
});
