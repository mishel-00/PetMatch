import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  onSelect: (especie: string) => void;
  selected: string;
};

export default function FiltroEspecie({ onSelect, selected }: Props) {
  const especies = ["todos", "perro", "gato"];

  return (
    <View style={styles.container}>
      {especies.map((e) => (
        <TouchableOpacity
          key={e}
          style={[styles.button, selected === e && styles.selected]}
          onPress={() => onSelect(e)}
        >
          <Text style={styles.text}>
            {e.charAt(0).toUpperCase() + e.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
    gap: 10,
  },
  button: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: "#D35400",
  },
  text: {
    color: "#000",
    fontWeight: "bold",
  },
});
