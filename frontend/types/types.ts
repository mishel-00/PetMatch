export interface Animal {
  id: string;
  foto: string;
  nombre: string;
  descripcion: string;
  sexo: string;
  especie: string;
  tipoRaza: string;
  tipoAnimal: string;
  peso: string;
  estado: "en adopcion" | "reservado" | "adoptado";
  esterilizado: boolean;
  fechaNacimiento: string;
  fechaIngreso: string;
}

