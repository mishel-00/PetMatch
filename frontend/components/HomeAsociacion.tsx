import { View, Text, Image, FlatList, StyleSheet } from "react-native";

const mascotas = [
  {
    id: "1",
    nombre: "Luna",
    edad: "2 años",
    raza: "Labrador",
    ubicacion: "Madrid",
  },
  {
    id: "2",
    nombre: "Simba",
    edad: "1 año",
    raza: "Golden Retriever",
    ubicacion: "Barcelona",
  },
];

export default function HomeAsociacion() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5E6" }}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenida Asociación 🐾</Text>
        <Text style={styles.subtitle}>¡Gracias por confiar en PetMatch!</Text>
      </View>
      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: "https://via.placeholder.com/300x200.png?text=Mascota" }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.details}>{item.edad} • {item.raza}</Text>
            <Text style={styles.location}>📍 {item.ubicacion}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D35400",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#A67C52",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D35400",
  },
  details: {
    fontSize: 16,
    color: "#333",
  },
  location: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
});
