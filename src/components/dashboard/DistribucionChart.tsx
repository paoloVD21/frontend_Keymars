import { Pie } from 'react-chartjs-2';
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

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right' as const,
        }
    }
};

const data = {
    labels: ['Electrónicos', 'Ropa', 'Hogar', 'Otros'],
    datasets: [
        {
            data: [40, 30, 20, 10],
            backgroundColor: [
                '#3b82f6',
                '#64748b',
                '#10b981',
                '#f59e0b',
            ],
            borderWidth: 0,
        }
    ]
};

export const DistribucionChart = () => {
    return (
        <div className={styles.chartContainer}>
            <div className={styles.header}>
                <h3 className={styles.title}>Distribución por Categoría</h3>
            </div>
            <div className={styles.chart}>
                <Pie options={options} data={data} />
            </div>
        </div>
    );
};