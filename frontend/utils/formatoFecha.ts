export const formatoFecha = (fecha: string | null | undefined): string => {
    if (!fecha) return "--";
  
    try {
      const date = new Date(fecha);
  
      const dia = String(date.getDate()).padStart(2, "0");
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const anio = date.getFullYear();
  
      return `${dia}-${mes}-${anio}`;
    } catch {
      return "--";
    }
  };
  