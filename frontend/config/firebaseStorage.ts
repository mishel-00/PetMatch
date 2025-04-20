// service/firebaseStorage.ts
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase"; // ✅ RUTA CORRECTA

export const uploadImageToFirebase = async (uri: string, filename: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `animales/${filename}`);
  await uploadBytes(storageRef, blob);

  return await getDownloadURL(storageRef);
};
