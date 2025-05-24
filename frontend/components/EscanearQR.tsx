import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native"; // Asegúrate de importar Alert
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/(tabs)/HomeStack";
import { auth } from "../config/firebase";
import axios from "axios";
import { API_URL } from "@/service/api";

export default function EscanearQR() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "EscanearQR">;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    // Alert.alert("QR Escaneado", data); // Opcional: para ver el contenido crudo del QR

    try {
      let citaId: string | null = null;
  
      // Intentar extraer el ID de la cita de diferentes formatos de URL
      if (data.startsWith("petmatch://cita?id=")) {
        citaId = data.substring("petmatch://cita?id=".length);
      } else if (data.includes("fichaAnimal?cita=")) {
        citaId = data.split("fichaAnimal?cita=")[1];
      } else if (data.includes("/api/citaPosible/escanear?id=")) {
        citaId = data.split("/api/citaPosible/escanear?id=")[1];
      } else {
        const match = data.match(/[?&](cita|id)=([^&]+)/);
        citaId = match?.[2] || null;
      }
  
      // Alert.alert("Cita ID Extraído", citaId || "No se pudo extraer el ID"); // Para ver el ID extraído
  
      if (!citaId) {
        Alert.alert("QR inválido", "No se encontró el parámetro 'cita' o 'id' en el código escaneado.");
        return;
      }
  
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }
  
      const token = await currentUser.getIdToken();

      const apiUrl = `${API_URL}/api/citaPosible/idAnimal`;
      
      // Mostrar la URL y el ID de la cita antes de hacer la petición
      Alert.alert(
        "Datos de la Petición", 
        `URL: ${apiUrl}\nCita ID: ${citaId}`
      );
  
      const response = await axios.get(apiUrl, {
        params: { id: citaId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = response.data;
  
      if (!result.animal) {
        Alert.alert("Error", "No se encontraron datos del animal.");
        return;
      }
  
      navigation.navigate("AnimalEscaneado", {
        animal: result.animal,
        id: citaId,
      });
  
    } catch (e: any) {
      // Mostrar detalles del error
      let errorMessage = "Error desconocido";
      if (e.message) {
        errorMessage = e.message;
      }
      if (e.response && e.response.data && e.response.data.error) {
        errorMessage += `\nDetalles: ${e.response.data.error}`;
      }
      Alert.alert(
        "QR inválido",
        `Error: ${errorMessage}. Verifique que el código QR sea válido y que tenga conexión a internet.`
      );
    }
  };
  

  if (hasPermission === null) return <Text>Solicitando permisos...</Text>;
  if (hasPermission === false) return <Text>Permiso denegado.</Text>;

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      />
    </View>
  );
}
