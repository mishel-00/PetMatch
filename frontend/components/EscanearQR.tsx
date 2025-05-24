import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { Camera } from "expo-camera"; 
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/(tabs)/HomeStack";
import { auth } from "../config/firebase";
import axios from "axios";
import { API_URL } from "@/service/api";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "EscanearQR">;

export default function EscanearQR() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<Camera>(null); // ✅

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    Alert.alert("📦 QR escaneado", data);

    try {
      let citaId: string | null = null;

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
      if (!citaId) return;

      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("❌ Error", "Usuario no autenticado.");
        return;
      }

      const token = await currentUser.getIdToken();
      const apiUrl = `${API_URL}/api/qr/citaid`;

      Alert.alert("📤 Enviando petición", `URL: ${apiUrl}\nID: ${citaId}`);

      const response = await axios.get(apiUrl, {
        params: { id: citaId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;

      if (!result.animal) {
        Alert.alert("⚠️ Animal no encontrado", "La cita existe pero no está vinculada a un animal.");
        return;
      }

      Alert.alert("✅ Animal encontrado", `Nombre: ${result.animal.nombre}`);

      navigation.navigate("AnimalEscaneado", {
        animal: result.animal,
        id: citaId,
      });
    } catch (e: any) {
      let errorMessage = e.message || "Error desconocido";
      if (e.response?.data) {
        errorMessage += `\n🧾 Backend: ${JSON.stringify(e.response.data)}`;
      }
      Alert.alert("❌ Error al procesar el QR", errorMessage);
    }
  };

  if (hasPermission === null) return <Text>Solicitando permisos...</Text>;
  if (hasPermission === false) return <Text>Permiso denegado a la cámara</Text>;

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        type="back"
        barCodeScannerSettings={{ barCodeTypes: ["qr"] }}
        onBarCodeScanned={handleBarCodeScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
