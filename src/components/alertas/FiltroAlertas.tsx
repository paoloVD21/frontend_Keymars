import { useState, useEffect } from 'react';
import type { AlertaFiltros } from '../../types/alerta';
import styles from './FiltroAlertas.module.css';
import { useSucursales } from '../../hooks/useSucursales';

interface FiltroAlertasProps {
    onFiltrar: (filtros: AlertaFiltros) => void;
    filtrosActuales: AlertaFiltros;
}

const FiltroAlertas: React.FC<FiltroAlertasProps> = ({
    onFiltrar,
    filtrosActuales
}) => {
    const [estado, setEstado] = useState<string>(filtrosActuales.estado || '');
    const [sucursal, setSucursal] = useState<string>(filtrosActuales.id_sucursal?.toString() || '');
    const [mes, setMes] = useState<string>('');
    const [anio, setAnio] = useState<string>('');
    const { sucursales, isLoading, error } = useSucursales();

    // Inicializar mes y año desde filtrosActuales.mes (si existe)
    useEffect(() => {
        if (filtrosActuales.mes) {
            const [anioValue, mesValue] = filtrosActuales.mes.split('-');
            setAnio(anioValue);
            setMes(mesValue);
        }
    }, [filtrosActuales.mes]);

    const aplicarFiltros = (e: React.FormEvent) => {
        e.preventDefault();
        const filtros: AlertaFiltros = {};
        
        if (estado) filtros.estado = estado as 'creado' | 'stock_minimo' | 'stock_bajo';
        if (sucursal) filtros.id_sucursal = Number.parseInt(sucursal);
        if (mes && anio) filtros.mes = `${anio}-${mes}`;

        onFiltrar(filtros);
    };

    const limpiarFiltros = () => {
        setEstado('');
        setSucursal('');
        setMes('');
        setAnio('');
        onFiltrar({});
    };

    return (
        <div className={styles.filterContainer}>
            <form onSubmit={aplicarFiltros} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="estado" className={styles.label}>Estado</label>
                    <select
                        id="estado"
                        className={styles.select}
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="creado">Creado</option>
                        <option value="stock_minimo">Stock Mínimo</option>
                        <option value="stock_bajo">Stock Bajo</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="sucursal" className={styles.label}>Sucursal</label>
                    <select
                        id="sucursal"
                        className={styles.select}
                        value={sucursal}
                        onChange={(e) => setSucursal(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">Todas</option>
                        {error ? (
                            <option value="" disabled>Error al cargar sucursales</option>
                        ) : (
                            sucursales.map(sucursal => (
                                <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                    {sucursal.nombre}
                                </option>
                            ))
                        )}
                    </select>
                </div>


                <div className={styles.formGroup}>
                    <label htmlFor="mes" className={styles.label}>Mes</label>
                    <select
                        id="mes"
                        className={styles.select}
                        value={mes}
                        onChange={(e) => setMes(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="01">Enero</option>
                        <option value="02">Febrero</option>
                        <option value="03">Marzo</option>
                        <option value="04">Abril</option>
                        <option value="05">Mayo</option>
                        <option value="06">Junio</option>
                        <option value="07">Julio</option>
                        <option value="08">Agosto</option>
                        <option value="09">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="anio" className={styles.label}>Año</label>
                    <select
                        id="anio"
                        className={styles.select}
                        value={anio}
                        onChange={(e) => setAnio(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                        Filtrar
                    </button>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        onClick={limpiarFiltros}
                    >
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FiltroAlertas;