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
    Alert.alert("📦 QR escaneado", data); // Ver contenido crudo
  
    try {
      let citaId: string | null = null;
  
      // 🔍 Extraer citaId desde distintos formatos
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
  
      Alert.alert("🔍 ID extraído", citaId || "❌ No se pudo extraer el ID");
  
      if (!citaId) {
        Alert.alert("❌ QR inválido", "No se encontró el parámetro 'cita' o 'id' en el código escaneado.");
        return;
      }
  
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("❌ Error", "Usuario no autenticado.");
        return;
      }
  
      const token = await currentUser.getIdToken();
      Alert.alert("✅ Token obtenido", token.substring(0, 20) + "...");
  
      const apiUrl = `${API_URL}/api/citaPosible/idAnimal`;
      Alert.alert("📤 Enviando petición", `URL: ${apiUrl}\nID: ${citaId}`);
  
      // Hacer la petición al backend
      const response = await axios.get(apiUrl, {
        params: { id: citaId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      Alert.alert("✅ Respuesta recibida", `Status: ${response.status}`);
  
      const result = response.data;
  
      if (!result.animal) {
        Alert.alert("⚠️ Animal no encontrado", "La cita existe pero no está vinculada a un animal.");
        return;
      }
  
      Alert.alert("✅ Animal encontrado", `Nombre: ${result.animal.nombre}`);
  
      // Navegar con los datos
      navigation.navigate("AnimalEscaneado", {
        animal: result.animal,
        id: citaId,
      });
  
    } catch (e: any) {
      let errorMessage = "Error desconocido";
  
      if (e.message) {
        errorMessage = e.message;
      }
  
      if (e.response && e.response.data) {
        errorMessage += `\n🧾 Backend: ${JSON.stringify(e.response.data)}`;
      }
  
      Alert.alert(
        "❌ Error al procesar el QR",
        `Error: ${errorMessage}`
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
