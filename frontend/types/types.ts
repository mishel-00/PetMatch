export interface Animal {
    id: string;
    foto: string;
    nombre: string;
    sexo: string;
    tipoAnimal: string;
    estado: "en adopcion" | "reservado" | "adoptado";
  }
  