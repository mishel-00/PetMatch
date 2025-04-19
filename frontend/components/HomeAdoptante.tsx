import { View, Text, StyleSheet } from "react-native";

export default function HomeAdoptante() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido Adoptante 🐾</Text>
      <Text style={styles.subtitle}>¡Gracias por querer adoptar!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
});
