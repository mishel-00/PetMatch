import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import zustandStorage from "./zustandStorage";
import { postxxx , API_URL } from "@/service/api";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
interface AuthState {
    username: string | null;
    password: string | null;
    token: string | null;
    userId: number | null;
    isAuthenticated: boolean;
    isActive: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    reslogin: string;
}
//login
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            username: null,
            password: null,
            token: null,
            userId: null,
            isAuthenticated: false,
            isActive: false,
            reslogin: "",
            login: async (email, password) => {
              try {
                console.log("Intentando login con:", email, password);
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
                console.log("Usuario autenticado:", userCredential.user.email);
            
                const idToken = await userCredential.user.getIdToken();
                console.log("Token recibido:", idToken);
            
                await AsyncStorage.setItem("token", idToken); // Guarda el token
                const data = await postxxx(`api/adoptante/login`, {}); // el token se usa internamente en getHeaders()

                console.log("API_URL:", API_URL);

            
                set({
                  username: email,
                  token: idToken,
                  userId: data.userId,
                  isAuthenticated: true,
                  isActive: true,
                });
            
                return true;
              } catch (error: any) {
                console.error("Firebase error code:", error.code);
                console.error("Firebase error message:", error.message);
            
                if (error.code === "auth/user-not-found") {
                  console.log("Usuario no encontrado.");
                } else if (error.code === "auth/wrong-password") {
                  console.log("Contraseña incorrecta.");
                } else if (error.code === "auth/invalid-email") {
                  console.log("Email inválido.");
                } else if (error.code === "auth/invalid-credential") {
                  console.log("Las credenciales son incorrectas.");
                }
            
                return false;
              }
            
            
                
              },




            logout: () => {
                set({
                    username: null,
                    password: null,
                    token: null,
                    userId: null,
                    isAuthenticated: false,
                    isActive: false,
                });
            },
        }),
        {
            name: "auth-storage",
            storage: zustandStorage,
        }
    )
);

