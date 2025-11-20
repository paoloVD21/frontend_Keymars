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

const renderChartContent = (isLoading: boolean | undefined, data: DashboardDistribucion | null, chartData: any, options: any) => {
    if (isLoading) {
        return <div className={styles.loading}>Cargando...</div>;
    }
    if (data) {
        return <Doughnut data={chartData} options={options} />;
    }
    return <div className={styles.noData}>No hay datos disponibles</div>;
};

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
                {renderChartContent(isLoading, data, chartData, options)}
            </div>
        </div>
    );
};