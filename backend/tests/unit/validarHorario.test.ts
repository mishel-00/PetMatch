
import { validarHorario } from "../../src/utils/fnDatosFront";


describe("validarHorario", () => {
    const hoy = new Date();
    const formatoFecha = hoy.toISOString().split("T")[0];
  
    it("rechaza fecha pasada", () => {
      const ayer = new Date();
      ayer.setDate(hoy.getDate() - 1);
      const fechaPasada = ayer.toISOString().split("T")[0];
  
      const result = validarHorario(fechaPasada, "12:00");
      expect(result.valido).toBe(false);
      expect(result.error).toMatch(/fecha pasada/);
    });
  
    it("rechaza si la fecha es más de 6 días en el futuro", () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(hoy.getDate() + 7);
      const fecha = fechaFutura.toISOString().split("T")[0];
  
      const result = validarHorario(fecha, "10:00");
      expect(result.valido).toBe(false);
      expect(result.error).toMatch(/más de 6 días/);
    });
  
    it("rechaza hora pasada si es hoy", () => {
      const fecha = formatoFecha;
      const result = validarHorario(fecha, "00:01"); 
      expect(result.valido).toBe(false);
      expect(result.error).toMatch(/hora pasada/);
    });
  
    it("acepta fecha válida y hora futura", () => {
      const fecha = formatoFecha;
      const now = new Date();
      now.setMinutes(now.getMinutes() + 10); // hora futura
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
  
      const result = validarHorario(fecha, `${h}:${m}`);
      expect(result.valido).toBe(true);
    });
  });
  