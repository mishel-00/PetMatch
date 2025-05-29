import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/(tabs)/HomeStack";
import { API_URL } from "@/service/api";
import { formatoFecha } from "@/utils/formatoFecha";
import FiltroEspecie from "@/components/FiltroEspecie";


type Animal = {
  id: string;
  nombre: string;
  sexo: string;
  especie: string;
  tipoRaza: string;
  peso: string;
  estado: string;
  descripcion: string;
  esterilizado: boolean;
  fechaNacimiento: string;
  fechaIngreso: string;
  foto: string;
};

export default function AnimalesAsociacion({ route }: any) {
  const { asociacionId, nombre } = route.params;
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [especieSeleccionada, setEspecieSeleccionada] = useState("todos");

  console.log("id de la asociacion", asociacionId),

  // useEffect(() => {
  //   const cargarAnimales = async () => {
  //     try {
  //       const user = getAuth().currentUser;
  //       if (!user) throw new Error("No autenticado");
  
  //       const token = await user.getIdToken();
  //       const response = await axios.get(`${API_URL}/api/obtenerAnimales/${asociacionId}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  
  //       // 🔧 Aquí haces el mapeo para transformar los nombres
  //       const mapped = response.data.map((item: any) => ({
  //         id: item.id,
  //         nombre: item.nombre,
  //         especie: item.especie,
  //         sexo: item.sexo,
  //         foto: item.foto,
  //         fechaIngreso: item.fechaIngreso, 
  //         estado: item.estadoAdopcion, //  añadir esto
  //         // mapeo explícito
  //       }));
  
  //       setAnimales(mapped);
  //     } catch (error) {
  //       console.error("Error al obtener animales:", error);
  //       Alert.alert("Error", "No se pudieron cargar los animales.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   cargarAnimales();
  // }, [asociacionId]);


  //Este es el UseEffect para filtrar
  useEffect(() => {
    const cargarAnimales = async () => {
      try {
        
        const user = getAuth().currentUser;
        if (!user) throw new Error("No autenticado");
  
        const token = await user.getIdToken();
  
        let response;
  
        if (especieSeleccionada === "todos") {
          response = await axios.get(`${API_URL}/api/obtenerAnimales/${asociacionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          response = await axios.get(
            `${API_URL}/api/especie?especie=${especieSeleccionada}&asociacion_id=${asociacionId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        console.log(especieSeleccionada)
        console.log("📦 Respuesta completa:", response);
        console.log("📄 Datos:", response.data);
        console.log("🔍 Especie seleccionada:", especieSeleccionada);
        console.log("🏷️ Asociación ID:", asociacionId);
        Alert.alert(
          "Datos de respuesta",
          `📄 Especie seleccionada: ${especieSeleccionada}
        🏷️ Asociación ID: ${asociacionId}
        📦 Respuesta completa: ${JSON.stringify(response, null, 2)}
        📄 Datos: ${JSON.stringify(response.data, null, 2)}`
        );
        
        


        const mapped = response.data.map((item: any) => ({
          id: item.id,
          nombre: item.nombre,
          especie: item.especie,
          sexo: item.sexo,
          foto: item.foto,
          fechaIngreso: item.fechaIngreso || item.fecha_ingreso,
          estado: item.estadoAdopcion,
        }));
  
        setAnimales(mapped);
      } catch (error) {
        console.error("Error al obtener animales:", error);
        Alert.alert("Error", "No se pudieron cargar los animales.");
      } finally {
        setLoading(false);
      }
    };
  
    cargarAnimales();
  }, [especieSeleccionada, asociacionId]);
  
  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D35400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animales de {nombre}</Text>
      <FiltroEspecie selected={especieSeleccionada} onSelect={setEspecieSeleccionada} />
      <FlatList
        data={animales}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("AnimalDetalleAdoptante", { id: item.id, asociacionId })}>
            <View style={styles.card}>
              {item.foto && (
                <Image
                  source={{ uri: item.foto }}
                  style={styles.image}
                  />
              )}
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.row}>
                <Text style={styles.icon}>♀️</Text> Sexo: <Text style={styles.bold}>{item.sexo}</Text>
              </Text>
              <Text style={styles.row}>
                <Text style={styles.icon}>🐾</Text> Especie: <Text style={styles.bold}>{item.especie}</Text>
              </Text>
              <Text style={styles.row}>
                <Text style={styles.icon}>📅</Text> Ingreso: <Text style={styles.bold}>{formatoFecha (item.fechaIngreso)}</Text>
              </Text>
              <Text
  style={[
    styles.estado,
    item.estado === "adoptado"
      ? styles.adoptado
      : item.estado === "reservado"
      ? styles.reservado
      : styles.enAdopcion,
  ]}
>
  {item.estado?.toUpperCase()}
</Text>

            </View>
          </TouchableOpacity>
        )}
        
        ListEmptyComponent={<Text style={styles.empty}>No hay animales aún 🐾</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
     backgroundColor: "#FFF5E6", 
     padding: 20 
    },
  center: {
     flex: 1, 
     justifyContent: "center",
      alignItems: "center" 
    },
  title: {
     fontSize: 20,
      fontWeight: "bold",
       color: "#D35400", 
       marginBottom: 16 
      },
  card: {
     backgroundColor: "#fff",
      padding: 16,
       borderRadius: 10,
        marginBottom: 12,
         elevation: 2 
        },
  name: { 
    fontSize: 16, 
    fontWeight: "bold",
    color: "#2c3e50"
   },
  type: { 
    fontSize: 14, 
    color: "#555" 
  },
  empty: {
     textAlign: "center", 
     marginTop: 20, 
     
     color: "#999" 
    },
  row: { 
    fontSize: 14, 
    color: "#333",
     marginTop: 4 
    },
  icon: {
   fontSize: 14 
  },
bold: { 
  fontWeight: "bold", 
  color: "#2c3e50"
 },
estado: {
  marginTop: 10,
  fontWeight: "bold",
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 14,
  alignSelf: "flex-start",
  overflow: "hidden",
  fontSize: 12,
},
adoptado: {
  backgroundColor: "#d1c4e9",
  color: "#5e35b1",
},
reservado: {
  backgroundColor: "#ffe082",
  color: "#ef6c00",
},
enAdopcion: {
  backgroundColor: "#c8e6c9",
  color: "#2e7d32",
},
image: {
  width: "100%",
  aspectRatio: 1,
  borderRadius: 10,
  marginBottom: 10,
  resizeMode: "cover",
},



});
