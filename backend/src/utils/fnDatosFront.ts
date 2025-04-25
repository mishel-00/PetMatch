
import { firestore } from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

//**Funciones para ser consumidas por el front-end
export const formatoFecha = (fecha: firestore.Timestamp | null | undefined): string => {
    if (!fecha || typeof fecha.toDate !== "function") {
      return "--";
    }
  
    const date = fecha.toDate(); 
  
    const dia = String(date.getDate()).padStart(2, "0"); 
    const mes = String(date.getMonth() + 1).padStart(2, "0"); // 0 enero
    const anio = date.getFullYear();
  
    return `${dia}-${mes}-${anio}`;
  };