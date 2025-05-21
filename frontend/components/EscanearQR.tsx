import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
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
    console.log("QR escaneado:", data);

    try {
      console.log("QR escaneado:", data);
      Alert.alert("Contenido escaneado", data);
    
      // Buscar id o cita manualmente con regex
      const match = data.match(/[?&](cita|id)=([^&]+)/);
      const citaId = match?.[2];
    
      if (!citaId) {
        Alert.alert("QR inválido", "No se encontró el parámetro 'cita' o 'id'.");
        return;
      }
    
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }
    
      const token = await currentUser.getIdToken();
    
      const response = await axios.get(`${API_URL}/api/citaPosible/idAnimal`, {
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
    
    } catch (e) {
      console.error("Error al procesar el QR:", e);
      Alert.alert("QR inválido", `Error: ${(e as Error).message}`);
      Alert.alert("Contenido escaneado", data);

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
