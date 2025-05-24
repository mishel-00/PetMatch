import { ExpoConfig } from "@expo/config";

const config: ExpoConfig = {
  name: "frontend",
  slug: "frontend",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "petmatch", 
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.santicticontrol.frontend",
    permissions: ["CAMERA"], // 👈 Añadir esto

    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-camera", // 👈 Añadir esto

    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "eb68d876-64fc-4b71-b6cc-ee43d8305082", 
    },
  },
};

export default config;
