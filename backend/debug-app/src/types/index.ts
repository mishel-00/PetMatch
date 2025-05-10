export interface Cita {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  observaciones?: string;
  adoptante: {
    id: string;
    nombre: string;
  };
  animal: {
    id: string | null;
    nombre: string;
  };
}

export interface ActionResult {
  success: boolean;
  message: string;
}