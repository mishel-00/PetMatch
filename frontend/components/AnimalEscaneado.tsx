import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Button,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/app/(tabs)/HomeStack";
import { postxxx } from "@/service/api";

type Props = {
  route: RouteProp<RootStackParamList, "AnimalEscaneado">;
};

export default function AnimalEscaneado({ route }: Props) {
  const { animal, id: citaId } = route.params;
  const [isAdopted, setIsAdopted] = useState(false);
  const navigation = useNavigation();

  const handleAceptar = async () => {
    try {
      await postxxx("api/citaPosible/completar", {
        citaId,
        adoptado: isAdopted,
      });

      Alert.alert(
        " Confirmado",
        isAdopted
          ? "El animal fue adoptado."
          : "El animal no fue adoptado y seguirá en adopción."
      );

      navigation.navigate("HomeAsociacion" as never);
    } catch (error) {
      Alert.alert("❌ Error", "No se pudo enviar la información.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 Animal Escaneado</Text>
      <Text style={styles.label}>📄 ID de la cita: {citaId}</Text>
      <Text>ID del animal: {animal.id}</Text>
      <Text>Nombre: {animal.nombre}</Text>
      <Text>Especie: {animal.especie}</Text>
      <Text>Descripción: {animal.descripcion}</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>
          {isAdopted ? "✅ Se adoptará" : "🚫 No se adoptará"}
        </Text>
        <Switch
          value={isAdopted}
          onValueChange={setIsAdopted}
          thumbColor="#fff"
          trackColor={{ false: "#ccc", true: "#4cd137" }}
        />
      </View>

      <Button title="Aceptar" onPress={handleAceptar} color="#D35400" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#FFF5E6",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    justifyContent: "space-between",
  },
});
