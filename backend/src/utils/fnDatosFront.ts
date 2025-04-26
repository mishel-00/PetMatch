
import { firestore } from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import admin from "../firebase";


//? Cuando hago una consulta que devuelve muchos documentos, debo recorrerlos uno por uno si quiero procesarlos individualmente
export const limpiarHorariosPasados = async(): Promise<void> => {
  const fechaHoy = new Date();
  fechaHoy.setHours(0, 0, 0, 0);

  const horariosPasados = await admin.firestore()
    .collection("horarioDisponible")
    .where("fecha", "<", fechaHoy)
    .get();
  
   for (const horario of horariosPasados.docs) {
    const idHorario = horario.id;
  
    const tieneCitasAsociadas = await admin.firestore()
      .collection("citaPosible")
      .where("id_HorarioDisponible", "==", idHorario)
      .get();
  
    try {
      if (tieneCitasAsociadas.empty) {
        console.log("Borrando horario:", idHorario);
        await horario.ref.delete();
      } else {
        console.log("Horario con citas asociadas, no se borra:", idHorario);
      }
    } catch (error) {
      console.error("Error al borrar horario:", error);
    }
  }
};