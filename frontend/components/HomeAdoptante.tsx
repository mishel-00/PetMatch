//Esta es la pantalla pirncipal del adopnate que le sale al inciar sescion se le carga todos las asociaciones
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getxxx } from "@/service/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/app/(tabs)/HomeStack";

type Asociacion = {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "HomeAdoptante">;

export default function HomeAdoptante() {
  const [asociaciones, setAsociaciones] = useState<Asociacion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();;
  //Peticion para pedir las asociaciones con el GET
  useEffect(() => {
    const cargarAsociaciones = async () => {
      try {
        const data = await getxxx("api/asociaciones");
        setAsociaciones(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarAsociaciones();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido Adoptante 🐾</Text>
      <Text style={styles.subtitle}>¡Gracias por querer adoptar!</Text>

      <FlatList
        data={asociaciones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 20 }}
        renderItem={({ item }) => (
          //Boton para navefar a otra pantalla
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AnimalesAsociacion", { asociacionId: item.id, nombre: item.nombre })}
          >
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardDetail}>📍 {item.direccion}</Text>
            <Text style={styles.cardDetail}>📞 {item.telefono}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay asociaciones disponibles.</Text>}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#D35400",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#A67C52",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 6,
  },
  cardDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
  },
});
