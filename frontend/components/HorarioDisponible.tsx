import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { deletexxx, getxxx, postxxx } from "@/service/api";
import { Ionicons } from "@expo/vector-icons";

type Horario = { id: string; fecha: Date; hora: Date };

export default function HorarioDisponible() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInicial, setLoadingInicial] = useState(true);

  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        const data = await getxxx("api/horarioDisponible");
        if (data && Array.isArray(data)) {
          const horariosCargados = data.map((h: any) => {
            const [fechaParte, horaParte] = h.fechaHora.split("T");
            return {
              id: h.id,
              fecha: new Date(fechaParte),
              hora: new Date(`1970-01-01T${horaParte}`),
            };
          });
          setHorarios(horariosCargados);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudieron cargar los horarios.");
      } finally {
        setLoadingInicial(false);
      }
    };

    cargarHorarios();
  }, []);

  const guardarHorario = async () => {
    if (!fechaSeleccionada || !horaSeleccionada) {
      Alert.alert("Error", "Selecciona fecha y hora antes de guardar.");
      return;
    }

    setLoading(true);
    try {
      const fecha = format(fechaSeleccionada, "yyyy-MM-dd");
      const hora = format(horaSeleccionada, "HH:mm");

      const response = await postxxx("api/horarioDisponible", { fecha, hora });

      setHorarios(prev => [...prev, { id: response.id, fecha: fechaSeleccionada, hora: horaSeleccionada }]);
      setFechaSeleccionada(null);
      setHoraSeleccionada(null);

      Alert.alert("Éxito", "Horario guardado correctamente 🎉");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar el horario.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarHorario = async (index: number) => {
    const horario = horarios[index];

    Alert.alert(
      "Eliminar Horario",
      `¿Seguro que quieres eliminar el horario del ${format(horario.fecha, "EEEE, d 'de' MMMM", { locale: es })} a las ${format(horario.hora, "HH:mm")}h?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deletexxx(`api/horarioDisponible/${horario.id}`);
              const nuevos = [...horarios];
              nuevos.splice(index, 1);
              setHorarios(nuevos);
              Alert.alert("Éxito", "Horario eliminado correctamente 🎉");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "No se pudo eliminar el horario.");
            }
          },
        },
      ]
    );
  };

  if (loadingInicial) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestiona tus Horarios </Text>

      <TouchableOpacity
        style={[styles.saveButtonTop, loading && { backgroundColor: "#bdc3c7" }]}
        onPress={guardarHorario}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.saveContent}>
            <Ionicons name="save" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>Guardar Horario</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.selectorsBox}>
        <TouchableOpacity style={styles.selectorButton} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={20} color="#2980b9" />
          <Text style={styles.selectorText}>{fechaSeleccionada ? format(fechaSeleccionada, "dd/MM/yyyy") : "Seleccionar Fecha"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.selectorButton} onPress={() => setShowTimePicker(true)}>
          <Ionicons name="time" size={20} color="#2980b9" />
          <Text style={styles.selectorText}>{horaSeleccionada ? format(horaSeleccionada, "HH:mm") : "Seleccionar Hora"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listBox}>
        <FlatList
          data={horarios}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>No has añadido horarios aún 🗓️</Text>}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.cardDay}>{format(item.fecha, "EEEE", { locale: es }).toUpperCase()}</Text>
                <Text style={styles.cardDate}>{format(item.fecha, "d 'de' MMMM", { locale: es })}</Text>
                <Text style={styles.cardHour}>{format(item.hora, "HH:mm")}h</Text>
              </View>
              <TouchableOpacity onPress={() => eliminarHorario(index)}>
                <Ionicons name="trash" size={26} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={fechaSeleccionada || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          locale="es-ES"
          onChange={(_event, selectedDate) => {
            if (selectedDate) setFechaSeleccionada(selectedDate);
            setShowDatePicker(false);
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={horaSeleccionada || new Date()}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          locale="es-ES"
          onChange={(_event, selectedDate) => {
            if (selectedDate) setHoraSeleccionada(selectedDate);
            setShowTimePicker(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F9FAFB" },
  title: { fontSize: 30, fontWeight: "bold", color: "#D35400", marginBottom: 15, textAlign: "center" },
  saveButtonTop: { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#27ae60", padding: 14, borderRadius: 12, marginBottom: 20 },
  saveContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 8 },
  selectorsBox: { marginBottom: 20 },
  selectorButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10, borderColor: "#ccc", borderWidth: 1 },
  selectorText: { marginLeft: 10, fontSize: 16, color: "#333" },
  listBox: { backgroundColor: "#ffffff", padding: 14, borderRadius: 16, elevation: 2 },
  empty: { textAlign: "center", color: "#aaa", marginTop: 20, fontSize: 16 },
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fefefe", padding: 16, borderRadius: 14, marginBottom: 12, elevation: 2 },
  cardDay: { fontSize: 16, fontWeight: "bold", color: "#2c3e50" },
  cardDate: { fontSize: 14, color: "#7f8c8d", marginTop: 2 },
  cardHour: { fontSize: 16, color: "#3498db", marginTop: 4 },
});
