import { View, Text, Image, FlatList } from "react-native";

const mascotas = [
  {
    id: "1",
    nombre: "Luna",
    edad: "2 años",
    raza: "Labrador",
    ubicacion: "Madrid",
    imagen: "https://via.placeholder.com/300x200.png?text=Luna",
  },
  {
    id: "2",
    nombre: "Simba",
    edad: "1 año",
    raza: "Golden Retriever",
    ubicacion: "Barcelona",
    imagen: "https://via.placeholder.com/300x200.png?text=Simba",
  },
];

export default function Develist() {
  return (
    <FlatList
      data={mascotas}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View className="mb-4 bg-white p-4 rounded-2xl shadow-md">
          <Image
            source={{ uri: item.imagen }}
            className="w-full h-48 rounded-xl mb-3"
            resizeMode="cover"
          />
          <Text className="text-xl font-bold text-orange-500">{item.nombre}</Text>
          <Text className="text-base text-gray-700">{item.edad} • {item.raza}</Text>
          <Text className="text-sm text-gray-500 mt-1">📍 {item.ubicacion}</Text>
        </View>
      )}
    />
  );
}
