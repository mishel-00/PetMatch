//En esta pantalla le van aparecer las citas de pendienetes de cada asociacion para que las confirme o las rechaze
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getxxx, postxxx } from "@/service/api";
import { formatoFecha } from "@/utils/formatoFecha";

interface Cita {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  observaciones?: string;
  adoptante: {
    id: string;
    nombre: string;
  };
  animal: {
    id: string;
    nombre: string;
  };
}


export default function ListaCitasAsociacion() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarCitas = async () => {
    try {
      const data = await getxxx("api/citaPosible/pendientes/asociacion");
      setCitas(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las citas.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    cargarCitas();
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: "aceptada" | "rechazada") => {
    try {
      await postxxx(`api/citaPosible/validar`, {
        idCitaPosible: id,
        nuevoEstado: nuevoEstado,
      });
      Alert.alert("Éxito", `Cita ${nuevoEstado === "aceptada" ? "aceptada" : "rechazada"} correctamente`);
      cargarCitas(); // refrescar lista
    } catch (error:any) {
      const mensaje = error?.response?.data?.error || "No se pudo actualizar la cita.";
      Alert.alert("Error", mensaje);
    }
  };
  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Citas Recibidas</Text>

      {citas.length === 0 ? (
        <Text style={styles.empty}>No tienes citas aún</Text>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>{formatoFecha(item.fecha)}</Text>
              <Text style={styles.hour}>Hora: {item.hora}</Text>
              <Text style={styles.state}>Estado: {item.estado}</Text>
              {item.observaciones && (
                <Text style={styles.obs}>📝 {item.observaciones}</Text>
              )}
<Text style={styles.adoptante}>👤 Adoptante: {item.adoptante.nombre}</Text>
<Text style={styles.animal}>🐾 Animal: {item.animal.nombre}</Text>

              {item.estado === "pendiente" && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#27ae60" }]}
                    onPress={() => actualizarEstado(item.id, "aceptada")}
                  >
                    <Text style={styles.buttonText}>Aceptar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#e74c3c" }]}
                    onPress={() => actualizarEstado(item.id, "rechazada")}
                  >
                    <Text style={styles.buttonText}>Rechazar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF5E6" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#D35400", marginBottom: 20 },
  empty: { fontSize: 16, textAlign: "center", marginTop: 30, color: "#999" },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
  },
  date: { fontSize: 16, fontWeight: "bold", color: "#2c3e50" },
  hour: { fontSize: 15, color: "#555", marginTop: 4 },
  state: { fontSize: 15, color: "#6E2C00", marginTop: 4 },
  obs: { fontSize: 14, fontStyle: "italic", marginTop: 4, color: "#7f8c8d" },
  adoptante: { fontSize: 14, marginTop: 4, color: "#3498db" },
  animal: { fontSize: 14, marginTop: 4, color: "#8e44ad" }, 
  actions: { flexDirection: "row", marginTop: 10, gap: 10 },
  button: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});



