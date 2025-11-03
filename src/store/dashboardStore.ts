import { create } from 'zustand';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats, DashboardMovimientos, DashboardDistribucion } from '../types/dashboard';

interface DashboardStore {
    // Estados
    stats: DashboardStats | null;
    movimientos: DashboardMovimientos | null;
    distribucion: DashboardDistribucion | null;
    isLoading: {
        stats: boolean;
        movimientos: boolean;
        distribucion: boolean;
    };
    error: string | null;

    // Acciones
    fetchStats: () => Promise<void>;
    fetchMovimientos: () => Promise<void>;
    fetchDistribucion: () => Promise<void>;
    fetchAllDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    // Estados iniciales
    stats: null,
    movimientos: null,
    distribucion: null,
    isLoading: {
        stats: false,
        movimientos: false,
        distribucion: false
    },
    error: null,

    // Acciones
    fetchStats: async () => {
        try {
            set(state => ({
                isLoading: { ...state.isLoading, stats: true },
                error: null
            }));
            const stats = await dashboardService.getStats();
            set(state => ({
                stats,
                isLoading: { ...state.isLoading, stats: false }
            }));
        } catch (err) {
            console.error('Error al cargar las estadísticas:', err);
            set(state => ({
                error: 'Error al cargar las estadísticas',
                isLoading: { ...state.isLoading, stats: false }
            }));
        }
    },

    fetchMovimientos: async () => {
        try {
            set(state => ({
                isLoading: { ...state.isLoading, movimientos: true },
                error: null
            }));
            const movimientos = await dashboardService.getMovimientos();
            set(state => ({
                movimientos,
                isLoading: { ...state.isLoading, movimientos: false }
            }));
        } catch (err) {
            console.error('Error al cargar los movimientos:', err);
            set(state => ({
                error: 'Error al cargar los movimientos',
                isLoading: { ...state.isLoading, movimientos: false }
            }));
        }
    },

    fetchDistribucion: async () => {
        try {
            set(state => ({
                isLoading: { ...state.isLoading, distribucion: true },
                error: null
            }));
            const distribucion = await dashboardService.getDistribucion();
            set(state => ({
                distribucion,
                isLoading: { ...state.isLoading, distribucion: false }
            }));
        } catch (err) {
            console.error('Error al cargar la distribución:', err);
            set(state => ({
                error: 'Error al cargar la distribución',
                isLoading: { ...state.isLoading, distribucion: false }
            }));
        }
    },

    fetchAllDashboardData: async () => {
        set(() => ({
            isLoading: { stats: true, movimientos: true, distribucion: true },
            error: null
        }));

        try {
            const [stats, movimientos, distribucion] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getMovimientos(),
                dashboardService.getDistribucion()
            ]);

            set(() => ({
                stats,
                movimientos,
                distribucion,
                isLoading: { stats: false, movimientos: false, distribucion: false }
            }));
        } catch (err) {
            console.error('Error al cargar los datos del dashboard:', err);
            set(() => ({
                error: 'Error al cargar los datos del dashboard',
                isLoading: { stats: false, movimientos: false, distribucion: false }
            }));
        }
    }
}));