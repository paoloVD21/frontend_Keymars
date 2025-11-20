import React from 'react';
import { Bar } from 'react-chartjs-2';
import styles from './MovimientosChart.module.css';
import type { DashboardMovimientos } from '../../types/dashboard';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface MovimientosChartProps {
    data: DashboardMovimientos | null;
    isLoading?: boolean;
}

const renderChartContent = (isLoading: boolean | undefined, data: DashboardMovimientos | null, chartData: any, options: any) => {
    if (isLoading) {
        return <div className={styles.loading}>Cargando...</div>;
    }
    if (data) {
        return <Bar options={options} data={chartData} height={250} />;
    }
    return <div className={styles.noData}>No hay datos disponibles</div>;
};

export const MovimientosChart: React.FC<MovimientosChartProps> = ({ data, isLoading }) => {
    const chartData = {
        labels: data?.labels || [],
        datasets: [
            {
                label: 'Ingresos',
                data: data?.entradas || [],
                backgroundColor: '#3b82f6',
                borderRadius: 4,
            },
            {
                label: 'Salidas',
                data: data?.salidas || [],
                backgroundColor: '#94a3b8',
                borderRadius: 4,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className={styles.chartContainer}>
            <div className={styles.header}>
                <h3 className={styles.title}>Movimientos Mensuales</h3>
                <div className={styles.controls}>
                    {/* Aquí puedes agregar controles adicionales */}
                </div>
            </div>
            <div className={styles.chart}>
                {renderChartContent(isLoading, data, chartData, options)}
            </div>
        </div>
    );
};