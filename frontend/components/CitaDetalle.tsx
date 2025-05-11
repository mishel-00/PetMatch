import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { formatoFecha } from "@/utils/formatoFecha";
import { getxxx } from "@/service/api"; // asume que ya tienes este helper

type Cita = {
  id: string;
  nombreAnimal: string;
  especie: string;
  fecha: string;
  hora: string;
  asociacionNombre: string;
};

export default function CitaDetalle() {
  const route = useRoute<RouteProp<{ params: { cita: Cita } }, "params">>();
  const { cita } = route.params;
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const response = await getxxx(`api/citaPosible/${cita.id}/qr`);
     
        setQrUrl(response.qrCodeURL);;
        console.log(response.qrCodeURL) // debe ser { url: 'https://...' }
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el código QR.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchQR();
  }, [cita.id]);
  console.log(cita.id)
  //console.log(response.qrCodeURL) // debe ser { url: 'https://...' }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 Detalles de la Cita</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#D35400" />
      ) : qrUrl ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: qrUrl }} style={styles.qrImage} />
        </View>
      ) : (
        <Text style={{ color: "red" }}>No se pudo cargar el código QR</Text>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.info}>🐾 Animal: {cita.nombreAnimal}</Text>
        <Text style={styles.info}>📍 Asociación: {cita.asociacionNombre}</Text>
        <Text style={styles.info}>📅 {formatoFecha(cita.fecha)} a las {cita.hora}h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#D35400",
    textAlign: "center",
  },
  qrContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    marginBottom: 30,
  },
  qrImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  infoContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
});
