import React, { useEffect } from 'react';
import styles from './DashboardView.module.css';
import { StatCard } from '../../components/dashboard/StatCard';
import { MovimientosChart } from '../../components/dashboard/MovimientosChart';
import { DistribucionChart } from '../../components/dashboard/DistribucionChart';
import { TbBox } from 'react-icons/tb';
import { FaTruckMoving } from 'react-icons/fa';
import { FiTruck } from 'react-icons/fi';
import { useDashboardStore } from '../../store/dashboardStore';

const DashboardView: React.FC = () => {
    const { 
        stats, 
        movimientos, 
        distribucion, 
        isLoading, 
        error,
        fetchAllDashboardData 
    } = useDashboardStore();

    useEffect(() => {
        fetchAllDashboardData();
    }, [fetchAllDashboardData]);

    if (error) {
        return (
            <div className={styles.error}>
                {error}
            </div>
        );
    }

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
                    value={stats?.totalProductos.toLocaleString() ?? '...'}
                    icon={<TbBox size={24} />}
                    trend={stats ? {
                        value: stats.tendencias.productos.valor,
                        label: "vs mes anterior",
                        isPositive: stats.tendencias.productos.esPositivo
                    } : undefined}
                    isLoading={isLoading.stats}
                />
                <StatCard
                    title="Stock Disponible"
                    value={stats?.stockDisponible.toLocaleString() ?? '...'}
                    icon={<FiTruck size={24} />}
                    trend={stats ? {
                        value: stats.tendencias.stock.valor,
                        label: "vs mes anterior",
                        isPositive: stats.tendencias.stock.esPositivo
                    } : undefined}
                    isLoading={isLoading.stats}
                />
                <StatCard
                    title="Proveedores Activos"
                    value={stats?.proveedoresActivos.toLocaleString() ?? '...'}
                    icon={<FaTruckMoving size={24} />}
                    trend={stats ? {
                        value: stats.tendencias.proveedores.valor,
                        label: "nuevos este mes",
                        isPositive: stats.tendencias.proveedores.esPositivo
                    } : undefined}
                    isLoading={isLoading.stats}
                />
            </div>

            <div className={styles.chartsGrid}>
                <MovimientosChart 
                    data={movimientos} 
                    isLoading={isLoading.movimientos} 
                />
                <DistribucionChart 
                    data={distribucion} 
                    isLoading={isLoading.distribucion} 
                />
            </div>
        </div>
    );
};

export default DashboardView;