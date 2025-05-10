import axios from 'axios';
import { Cita } from '../types';

const API_URL = 'http://localhost:3000/api';

export const fetchCitasPendientes = async (): Promise<Cita[]> => {
  const response = await axios.get(`${API_URL}/debug/citasPendientes`);
  return response.data;
};

export const validarCita = async (idCita: string, nuevoEstado: 'aceptada' | 'rechazada') => {
  const response = await axios.post(`${API_URL}/debug/citaPosible/validar`, {
    idCitaPosible: idCita,
    nuevoEstado
  });
  return response.data;
};