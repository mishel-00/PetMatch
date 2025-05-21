import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/app/(tabs)/HomeStack"; // Ajusta la ruta si es distinta


export default function SessionRedirector() {
  const { isAuthenticated, rol } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  useEffect(() => {
    if (isAuthenticated) {
      if (rol === "adoptante") {
        navigation.reset({ index: 0, routes: [{ name: "HomeAdoptante" }] });
      } else if (rol === "asociacion") {
        navigation.reset({ index: 0, routes: [{ name: "HomeAsociacion" }] });
      }
    } else {
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    }
  }, [isAuthenticated, rol]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#D35400" />
    </View>
  );
}
