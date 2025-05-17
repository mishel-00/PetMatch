// Aqui configuramos las notificaciones para cpoder enviar las notificaciones a cada usuario
//Primero comporbamos si el dispositivo osea el mvil es real para genear el token FCM y luego se genera y 
//poder enviaserlo al backend con id del usario asi el backend sabe cada token con que usario va relacionado 
//Entonces yo escucho todo el rato si me llega una notificacion para imprimirla con expo-notifications
// y cuando la echucho la imprimo nada mas me llega por lo tanto todo es al instante


import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventSubscription } from "expo-modules-core";
import { postxxx } from "@/service/api";

// Configura cómo se muestran las notificaciones al usuario
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

class NotificationService {
  private responseSubscription: EventSubscription | null = null;

  constructor() {
    this.setupNotificationResponseListener();
  }

  private setupNotificationResponseListener() {
    this.responseSubscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const data = response.notification.request.content.data;
        console.log("📲 Notificación tocada:", data);
        // Aquí puedes navegar o ejecutar lógica adicional si el usuario toca la notificación
      }
    );
  }
  // Con registerDevice saemos si es dispotivio fisico
  public async registerDevice(userId: string): Promise<void> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.warn("Permisos de notificaciones denegados");
        return;
      }
      // Esta es lo que le pido al Firebase que me de token de FCM 
      const { data: token } = await Notifications.getDevicePushTokenAsync();
      console.log("✅ Token FCM obtenido:", token);
      await AsyncStorage.setItem("deviceToken", token);

      // Aqui le envio el token creado con FCM con el id del usario
      await postxxx("/api/register-push-token", {
        token,
        userId,
        platform: Platform.OS,
      });
    } catch (error) {
      console.error("❌ Error registrando dispositivo:", error);
    }
  }

  // El cuperpo de la notificacin 
  public async showLocalNotification({
    title,
    body,
    data,
  }: {
    title: string;
    body: string;
    data?: any;
  }) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, 
      });
    } catch (error) {
      console.error("❌ Error mostrando notificación local:", error);
    }
  }

  public disconnect() {
    this.responseSubscription?.remove();
    this.responseSubscription = null;
  }
}

export const notificationService = new NotificationService();
