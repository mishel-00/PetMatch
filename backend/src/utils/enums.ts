

export const ESTADOS_ADOPCION = [
    "En adopcion",
    "Reservado", 
    "Adoptado"
] as const;
export type EstadoAdopcion = typeof ESTADOS_ADOPCION[number];