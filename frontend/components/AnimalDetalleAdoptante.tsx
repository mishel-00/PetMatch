//Panatlla donde salen tdoos los datos del animal para asi adopnate ver con detalle el animal y si quiere 
// Pueda pedir cita a ese animal y que le llegue a la asociacion
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome5";
import { getxxx, postxxx } from "@/service/api";
import { formatoFecha } from "@/utils/formatoFecha";

interface Animal {
  id: string;
  nombre: string;
  sexo: string;
  especie: string;
  tipoRaza: string;
  peso: string;
  estado: string;
  descripcion: string;
  esterilizado: boolean;
  fechaNacimiento: string;
  fechaIngreso: string;
  foto: string;
}

export default function AnimalDetalleAdoptante({ route }: any) {
  const { id, asociacionId } = route.params;
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState<any[]>([]);
  const [horasDelDia, setHorasDelDia] = useState<string[]>([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<string | null>(null);
  const [citaConfirmada, setCitaConfirmada] = useState(false);


  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const data = await getxxx(`api/animal/${id}/asociacion/${asociacionId}`);
        setAnimal({
          ...data,
          estado: data.estadoAdopcion,
          fechaNacimiento: data.fecha_nacimiento,
          fechaIngreso: data.fecha_ingreso,
        });
      } catch {
        Alert.alert("Error", "No se pudo cargar el animal.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id, asociacionId]);

  const cargarHorarios = async () => {
    try {
      const data = await getxxx(`api/horarioDisponible/asociacion/${asociacionId}`);
      setHorariosDisponibles(data);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los horarios.");
    }
  };

  const onSelectDate = (day: any) => {
    const fecha = day.dateString;
    setSelectedDate(fecha);
    setHorarioSeleccionado(null);

    const encontrado = horariosDisponibles.find(h => h.fecha === fecha);
    setHorasDelDia(encontrado ? encontrado.horas : []);
  };

  const handleConfirmarCita = async () => {
    if (!selectedDate || !horarioSeleccionado) return;
  
    try {
      await postxxx("api/citas/crear", {
        animalId: id,
        asociacionId,
        fecha: selectedDate,
        hora: horarioSeleccionado,
      });
  
      setCitaConfirmada(true);
  
      // Esperar 2 segundos antes de cerrar el modal
      setTimeout(() => {
        setModalVisible(false);
        setCitaConfirmada(false);
        setHorarioSeleccionado(null);
        setSelectedDate(null);
      }, 2000);
    } catch {
      Alert.alert("Error", "No se pudo solicitar la cita.");
    }
  };
  
  if (loading || !animal) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  const sexoFormateado = animal.sexo.toLowerCase() === "macho" ? "Macho" : "Hembra";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Image source={{ uri: animal.foto }} style={styles.image} />
      <View style={styles.nameRow}>
        <Text style={styles.name}>{animal.nombre}</Text>
        <TouchableOpacity
          style={styles.patitaBtnSmall}
          onPress={() => {
            setModalVisible(true);
            cargarHorarios();
          }}
        >
          <Icon name="paw" size={18} color="#fff" />
          <Text style={styles.patitaText}>Pedir cita</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Sexo: <Text style={styles.value}>{sexoFormateado}</Text></Text>
        <Text style={styles.label}>Especie: <Text style={styles.value}>{animal.especie}</Text></Text>
        <Text style={styles.label}>Raza: <Text style={styles.value}>{animal.tipoRaza}</Text></Text>
        <Text style={styles.label}>Peso: <Text style={styles.value}>{animal.peso}</Text></Text>
        <Text style={styles.label}>Estado: <Text style={[styles.estado, getEstadoColor(animal.estado)]}>{animal.estado.toUpperCase()}</Text></Text>
        <Text style={styles.label}>Esterilizado: <Text style={styles.value}>{animal.esterilizado ? "Sí" : "No"}</Text></Text>
        <Text style={styles.label}>Nacimiento: <Text style={styles.value}>{formatoFecha(animal.fechaNacimiento)}</Text></Text>
        <Text style={styles.label}>Ingreso: <Text style={styles.value}>{formatoFecha(animal.fechaIngreso)}</Text></Text>
      </View>

      <Text style={styles.descriptionTitle}>Descripción:</Text>
      <Text style={styles.description}>{animal.descripcion}</Text>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Calendar
              onDayPress={onSelectDate}
              markedDates={selectedDate ? { [selectedDate]: { selected: true } } : {}}
            />
            {selectedDate && (
              <>
                <Text style={styles.modalTitle}>Horarios para {formatoFecha(selectedDate)}</Text>
                <FlatList
                  data={horasDelDia}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setHorarioSeleccionado(item)}>
                      <Text style={[
                        styles.horario,
                        horarioSeleccionado === item && styles.horarioSeleccionado
                      ]}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={<Text style={styles.empty}>No hay horarios</Text>}
                />
                {citaConfirmada && (
  <Text style={styles.successMessage}>✅ Cita enviada correctamente</Text>
)}

              </>
            )}
            {horarioSeleccionado && (
              <TouchableOpacity style={styles.confirmarBtn} onPress={handleConfirmarCita}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Confirmar cita</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getEstadoColor = (estado: string) => {
  if (estado === "adoptado") return styles.adoptado;
  if (estado === "reservado") return styles.reservado;
  return styles.enAdopcion;
};

// (los estilos son los mismos que ya tienes, no hace falta repetirlos aquí)



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5E6", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 220, borderRadius: 12, marginBottom: 16 },
  name: { fontSize: 26, fontWeight: "bold", color: "#D35400", textAlign: "center", marginBottom: 14 },
  infoBox: { backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 2 },
  label: { fontSize: 15, fontWeight: "600", color: "#6E2C00", marginTop: 10 },
  value: { fontWeight: "normal", color: "#333" },
  estado: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "bold",
    fontSize: 13,
    overflow: "hidden",
  },
  adoptado: { backgroundColor: "#d1c4e9", color: "#5e35b1" },
  reservado: { backgroundColor: "#ffe082", color: "#ef6c00" },
  enAdopcion: { backgroundColor: "#c8e6c9", color: "#2e7d32" },
  descriptionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, color: "#A04000" },
  description: { fontSize: 15, color: "#5D6D7E", lineHeight: 20, backgroundColor: "#fff", padding: 12, borderRadius: 10, marginTop: 4, elevation: 1 },

  // Botón para patita
  patitaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D35400",
    padding: 12,
    marginTop: 20,
    borderRadius: 10,
    alignSelf: "center",
    gap: 10,
  },
  patitaText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 15,
  },
  horarioSeleccionado: {
    backgroundColor: "#D35400",
    color: "#fff",
  },
  

  // dialog que le salga el calnedario para pedir cita
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: {
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  horario: {
    padding: 8,
    textAlign: "center",
    backgroundColor: "#FAD7A0",
    borderRadius: 6,
    marginTop: 6,
  },
  empty: {
    marginTop: 10,
    textAlign: "center",
    color: "#999",
  },
  closeBtn: {
    backgroundColor: "#D35400",
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  patitaBtnSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D35400",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  confirmarBtn: {
    backgroundColor: "#28A745",
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  successMessage: {
    marginTop: 12,
    textAlign: "center",
    color: "#28A745",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  
  
});
