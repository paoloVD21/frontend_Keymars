import { Bar } from 'react-chartjs-2';
import styles from './MovimientosChart.module.css';
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

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
        title: {
            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

const data = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Ingresos',
            data: [120, 150, 180, 190, 170, 185],
            backgroundColor: '#3b82f6',
            borderRadius: 4,
        },
        {
            label: 'Salidas',
            data: [80, 90, 120, 140, 110, 130],
            backgroundColor: '#94a3b8',
            borderRadius: 4,
        }
    ]
};

export const MovimientosChart = () => {
    return (
        <div className={styles.chartContainer}>
            <div className={styles.header}>
                <h3 className={styles.title}>Movimientos Mensuales</h3>
                <div className={styles.controls}>
                    {/* Aquí puedes agregar controles adicionales */}
                </div>
            </div>
            <div className={styles.chart}>
                <Bar options={options} data={data} height={250} />
            </div>
        </div>
    );
};