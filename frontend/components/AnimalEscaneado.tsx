import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Button,
  Alert,
  ScrollView,
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
        "✅ Confirmado",
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.icon}>🐾</Text>
      <Text style={styles.title}>Animal Escaneado</Text>

      <View style={styles.animalCard}>
        <Text style={styles.info}>🐶 Nombre: {animal.nombre}</Text>
        <Text style={styles.info}>🧬 Especie: {animal.especie}</Text>
        <Text style={styles.info}>📖 Descripción: {animal.descripcion}</Text>
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.adopcionText, { color: isAdopted ? "#27ae60" : "#c0392b" }]}>
          {isAdopted ? "✅ Se adoptará" : "🚫 No se adoptará"}
        </Text>
        <Switch
          value={isAdopted}
          onValueChange={setIsAdopted}
          thumbColor="#fff"
          trackColor={{ false: "#ccc", true: "#4cd137" }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="ACEPTAR" onPress={handleAceptar} color="#D35400" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#FFF5E6",
    flexGrow: 1,
    justifyContent: "center",
  },
  icon: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#D35400",
  },
  animalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  info: {
    fontSize: 17,
    color: "#333",
    marginBottom: 10,
  },
  adopcionText: {
    fontSize: 18,
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
