
import { firestore } from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import admin from "../firebase";

//PRUEBA
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

//* validar HorarioDisponible
export function validarHorario(fecha: string, hora: string): { valido: boolean; error?: string } {
  const fechaObj = new Date(fecha);
  const ahora = new Date();
  ahora.setHours(0, 0, 0, 0);

  const fechaSoloDia = new Date(fechaObj);
  fechaSoloDia.setHours(0, 0, 0, 0);

  const limiteMaximo = new Date();
  limiteMaximo.setDate(ahora.getDate() + 6);

  if (fechaSoloDia.getTime() < ahora.getTime()) {
    return { valido: false, error: "No se puede crear un horario en una fecha pasada" };
  }

  if (fechaObj > limiteMaximo) {
    return { valido: false, error: "El horario no puede ser con más de 6 días de antelación" };
  }

  const esHoy = fechaSoloDia.getTime() === ahora.getTime();
  if (esHoy) {
    const [h, m] = hora.split(":").map(Number);
    const horaProgramada = new Date();
    horaProgramada.setHours(h, m, 0, 0);

    const ahoraConHora = new Date();
    if (horaProgramada < ahoraConHora) {
      return { valido: false, error: "No se puede crear un horario en una hora pasada" };
    }
  }

  return { valido: true };
}
