import { useState, useEffect } from 'react';
import styles from './ReportesView.module.css';
import { useSucursales } from '../../hooks/useSucursales';

interface FiltrosReporte {
    periodoTiempo: 'mes' | 'trimestre' | 'año';
    sucursal?: number;
    tipoReporte: 'resumen' | 'stockBajo' | 'movimientos';
}

export const ReportesView = () => {
    const { sucursales, isLoading, error } = useSucursales();
    const [filtros, setFiltros] = useState<FiltrosReporte>({
        tipoReporte: 'resumen',
        periodoTiempo: 'mes',
        sucursal: undefined
    });

    // Seleccionar la primera sucursal por defecto cuando se cargan
    useEffect(() => {
        if (sucursales.length > 0 && !filtros.sucursal) {
            setFiltros(prev => ({
                ...prev,
                sucursal: sucursales[0].id_sucursal
            }));
        }
    }, [sucursales, filtros.sucursal]);

    const tiposReporte = [
        { id: 'resumen', nombre: 'Resumen de Inventario' },
        { id: 'stockBajo', nombre: 'Stock Bajo' },
        { id: 'movimientos', nombre: 'Mayores Movimientos' }
    ];

    const periodosTiempo = [
        { id: 'mes', nombre: 'Último Mes' },
        { id: 'trimestre', nombre: 'Último Trimestre' },
        { id: 'año', nombre: 'Último Año' }
    ];

    const handleExportExcel = async () => {
        // Implementar exportación a Excel
        console.log('Exportando a Excel...', {
            ...filtros,
            formato: 'excel'
        });
    };

    const handleExportPDF = async () => {
        // Implementar exportación a PDF
        console.log('Exportando a PDF...', {
            ...filtros,
            formato: 'pdf'
        });
    };

    return (
        <div className={styles.reportesContainer}>
            <h2 className={styles.title}>Reportes</h2>
            
            <div className={styles.filtrosSection}>
                <div className={styles.tipoReporteSelector}>
                    <h3 className={styles.subtitle}>Tipo de Reporte</h3>
                    <div className={styles.tiposReporte}>
                        {tiposReporte.map(tipo => (
                            <button
                                key={tipo.id}
                                className={`${styles.tipoButton} ${filtros.tipoReporte === tipo.id ? styles.active : ''}`}
                                onClick={() => setFiltros(prev => ({ ...prev, tipoReporte: tipo.id as FiltrosReporte['tipoReporte'] }))}
                            >
                                {tipo.nombre}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.filtrosAdicionales}>
                    <h3 className={styles.subtitle}>Período de Tiempo</h3>
                    <div className={styles.tiposReporte}>
                        {periodosTiempo.map(periodo => (
                            <button
                                key={periodo.id}
                                className={`${styles.tipoButton} ${filtros.periodoTiempo === periodo.id ? styles.active : ''}`}
                                onClick={() => setFiltros(prev => ({ ...prev, periodoTiempo: periodo.id as FiltrosReporte['periodoTiempo'] }))}
                            >
                                {periodo.nombre}
                            </button>
                        ))}
                    </div>

                    <div className={styles.sucursalesSection}>
                        <h3 className={styles.subtitle}>Sucursal</h3>
                        <div className={styles.sucursalList}>
                            {error ? (
                                <div className={`${styles.sucursalCard} ${styles.error}`}>
                                    <h4>Error al cargar sucursales</h4>
                                </div>
                            ) : (
                                sucursales.map(sucursal => (
                                    <div
                                        key={sucursal.id_sucursal}
                                        className={`${styles.sucursalCard} ${filtros.sucursal === sucursal.id_sucursal ? styles.selected : ''}`}
                                        onClick={() => setFiltros(prev => ({ ...prev, sucursal: sucursal.id_sucursal }))}
                                    >
                                        <h4>{sucursal.nombre}</h4>
                                    </div>
                                ))
                            )}
                        </div>
                        {isLoading && <span className={styles.loadingText}>Cargando sucursales...</span>}
                        {error && <span className={styles.errorText}>{error}</span>}
                    </div>
                </div>
            </div>

            <div className={styles.exportButtons}>
                <button
                    onClick={handleExportExcel}
                    className={`${styles.exportButton} ${styles.excelButton}`}
                >
                    Exportar a Excel
                </button>
                <button
                    onClick={handleExportPDF}
                    className={`${styles.exportButton} ${styles.pdfButton}`}
                >
                    Exportar a PDF
                </button>
            </div>
        </div>
    );
};