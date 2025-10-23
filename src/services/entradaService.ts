import axios from 'axios';
import type { Entrada, EntradaCreate, EntradaResponse } from '../types/entrada';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const entradaService = {
    async getEntradas(fecha?: string) {
        try {
            const url = fecha 
                ? `${API_BASE_URL}/entradas?fecha=${fecha}` 
                : `${API_BASE_URL}/entradas`;
            const response = await axios.get<{ entradas: Entrada[] }>(url);
            return {
                entradas: response.data.entradas || []
            };
        } catch (error) {
            console.error('Error al obtener entradas:', error);
            throw error;
        }
    },

    async createEntrada(entrada: EntradaCreate) {
        try {
            const response = await axios.post<EntradaResponse>(
                `${API_BASE_URL}/entradas`,
                entrada
            );
            return response.data;
        } catch (error) {
            console.error('Error al crear entrada:', error);
            throw error;
        }
    },

    async getEntradaPorId(id: number) {
        try {
            const response = await axios.get<EntradaResponse>(
                `${API_BASE_URL}/entradas/${id}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener entrada:', error);
            throw error;
        }
    }
};