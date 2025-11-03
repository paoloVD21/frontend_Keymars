import styles from './ListaAlertas.module.css';
import type { Alerta } from '../../types/alerta';

interface ListaAlertasProps {
    alertas: Alerta[];
    cargando: boolean;
}

export default function ListaAlertas({ 
    alertas, 
    cargando 
}: ListaAlertasProps) {
    if (cargando) {
        return <div>Cargando alertas...</div>;
    }

    if (alertas.length === 0) {
        return (
            <div className={styles.empty}>
                No hay alertas para mostrar.
            </div>
        );
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Observación</th>
                            <th>Sucursal</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alertas.map((alerta) => (
                            <tr key={alerta.id_alerta}>
                                <td>{alerta.nombre_producto}</td>
                                <td>Stock</td>
                                <td>{alerta.observacion}</td>
                                <td>{alerta.nombre_sucursal}</td>
                                <td>{formatearFecha(alerta.fecha_alerta)}</td>
                                <td>
                                    <span className={`${styles.status} ${
                                        alerta.estado === 'stock_bajo'
                                            ? styles.statusBajo
                                            : alerta.estado === 'stock_minimo'
                                            ? styles.statusMinimo
                                            : styles.statusCreado
                                    }`}>
                                        {alerta.estado === 'creado' ? 'Creado' :
                                         alerta.estado === 'stock_minimo' ? 'Stock Mínimo' :
                                         'Stock Bajo'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}