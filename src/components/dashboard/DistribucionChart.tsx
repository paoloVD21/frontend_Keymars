import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { DashboardDistribucion } from '../../types/dashboard';
import styles from './DistribucionChart.module.css';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

interface DistribucionChartProps {
    data: DashboardDistribucion | null;
    isLoading?: boolean;
}

export const DistribucionChart: React.FC<DistribucionChartProps> = ({ data, isLoading }) => {
    const chartData = {
        labels: data?.labels || [],
        datasets: [
            {
                data: data?.data || [],
                backgroundColor: [
                    '#3b82f6', // Azul
                    '#64748b', // Gris
                    '#10b981', // Verde
                    '#f59e0b', // Ámbar
                    '#8B5CF6', // Violeta
                    '#EC4899', // Rosa
                ],
                borderWidth: 1,
                borderColor: '#ffffff',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: '#374151',
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    return (
        <div className={styles.chartContainer}>
            <div className={styles.header}>
                <h3 className={styles.title}>Distribución por Categoría</h3>
            </div>
            <div className={styles.chart}>
                {isLoading ? (
                    <div className={styles.loading}>Cargando...</div>
                ) : data ? (
                    <Doughnut data={chartData} options={options} />
                ) : (
                    <div className={styles.noData}>No hay datos disponibles</div>
                )}
            </div>
        </div>
    );
};