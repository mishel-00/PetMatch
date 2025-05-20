// screens/EscanearQR.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/(tabs)/HomeStack"; // ajusta la ruta si es distinta


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
      const url = new URL(data);
      const citaId = url.searchParams.get("cita");
  
      if (!citaId) {
        Alert.alert("QR inválido", "No se encontró el parámetro 'cita'.");
        return;
      }
  
      // Llamada GET al backend para obtener datos del animal
      const response = await fetch(`https://TU_BACKEND_URL/api/citaPosible/info?id=${citaId}`);
      if (!response.ok) throw new Error("Respuesta no válida del servidor");
  
      const result = await response.json();
  
      if (!result.animal) {
        Alert.alert("Error", "No se encontraron datos del animal.");
        return;
      }
  
      // Navegamos con los datos obtenidos
      navigation.navigate("AnimalEscaneado", {
        animal: result.animal,
        id: citaId,
      });
  
    } catch (e) {
      console.error("Error al procesar el QR:", e);
      Alert.alert("QR inválido", "No se pudo procesar el código QR.");
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
