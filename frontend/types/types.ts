export interface Animal {
  id: string;
  foto: string;
  nombre: string;
  sexo: string;
  tipoAnimal: string; // viene del campo "especie" del backend
  estado: "en adopcion" | "reservado" | "adoptado"; // se mapea desde "estadoAdopcion"
  descripcion?: string;
  esterilizado?: boolean;
  fechaNacimiento?: string;
  fechaIngreso?: string;
}
