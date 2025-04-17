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
                  const userCredential = await signInWithEmailAndPassword(auth, email, password);
                  const idToken = await userCredential.user.getIdToken();
              
                  const data = await postxxx(`${API_URL}/auth/login`, { token: idToken });
              
                  await AsyncStorage.setItem("token", idToken);
                  await AsyncStorage.setItem("userId", data.userId.toString());
              
                  set({
                    username: email,
                    token: idToken,
                    userId: data.userId,
                    isAuthenticated: true,
                    isActive: true,
                  });
              
                  return true;
                } catch (error) {
                  console.error("Error en login Firebase:", error);
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

