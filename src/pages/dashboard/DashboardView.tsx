import React from 'react';
import styles from './DashboardView.module.css';
import { StatCard } from '../../components/dashboard/StatCard';
import { MovimientosChart } from '../../components/dashboard/MovimientosChart';
import { DistribucionChart } from '../../components/dashboard/DistribucionChart';
import { TbBox } from 'react-icons/tb';
import { FaTruckMoving } from 'react-icons/fa';
import { FiTruck } from 'react-icons/fi';

const DashboardView: React.FC = () => {
    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.filters}>
                <select className={styles.filterSelect}>
                    <option>Todas las Sucursales</option>
                </select>
                <select className={styles.filterSelect}>
                    <option>Todas las Categorías</option>
                </select>
                <select className={styles.filterSelect}>
                    <option>Todos los Proveedores</option>
                </select>
            </div>

            <div className={styles.statsGrid}>
                <StatCard
                    title="Total Productos"
                    value="4,249"
                    icon={<TbBox size={24} />}
                    trend={{ value: "+12%", label: "vs mes anterior", isPositive: true }}
                />
                <StatCard
                    title="Stock Disponible"
                    value="89,432"
                    icon={<FiTruck size={24} />}
                    trend={{ value: "+5%", label: "vs mes anterior", isPositive: true }}
                />
                <StatCard
                    title="Proveedores Activos"
                    value="156"
                    icon={<FaTruckMoving size={24} />}
                    trend={{ value: "+8", label: "nuevos este mes", isPositive: true }}
                />
            </div>

            <div className={styles.chartsGrid}>
                <MovimientosChart />
                <DistribucionChart />
            </div>
        </div>
    );
};

export default DashboardView;