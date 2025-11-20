import { useState, useEffect } from 'react';
import styles from './ReportesView.module.css';
import { useSucursales } from '../../hooks/useSucursales';
import { reportService } from '../../services/reportService';

interface FiltrosReporte {
    periodo: 'ultimo_mes' | 'ultimo_trimestre' | 'ultimo_anio';
    sucursal?: number;
    tipo_reporte: 'resumen_inventario' | 'stock_bajo' | 'mayores_movimientos';
}

const downloadFile = (blob: Blob, fileName: string) => {
    const url = globalThis.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    globalThis.URL.revokeObjectURL(url);
};

export const ReportesView = () => {
    const { sucursales, isLoading, error } = useSucursales();
    const [filtros, setFiltros] = useState<FiltrosReporte>({
        tipo_reporte: 'resumen_inventario',
        periodo: 'ultimo_mes',
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
        { id: 'resumen_inventario', nombre: 'Resumen de Inventario' },
        { id: 'stock_bajo', nombre: 'Stock Bajo' },
        { id: 'mayores_movimientos', nombre: 'Mayores Movimientos' }
    ];

    const periodosTiempo = [
        { id: 'ultimo_mes', nombre: 'Último Mes' },
        { id: 'ultimo_trimestre', nombre: 'Último Trimestre' },
        { id: 'ultimo_anio', nombre: 'Último Año' }
    ];

    const [loading, setLoading] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    const handleExportExcel = async () => {
        try {
            setLoading(true);
            setExportError(null);

            const params = {
                tipo_reporte: filtros.tipo_reporte,
                periodo: filtros.periodo,
                id_sucursal: filtros.sucursal
            };

            const blob = await reportService.exportToExcel(params);
            const fileName = `reporte-${filtros.tipo_reporte}-${filtros.periodo}.xlsx`;
            downloadFile(blob, fileName);
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            setExportError('Error al generar el reporte Excel');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = async () => {
        try {
            setLoading(true);
            setExportError(null);

            const params = {
                tipo_reporte: filtros.tipo_reporte,
                periodo: filtros.periodo,
                id_sucursal: filtros.sucursal
            };

            const blob = await reportService.exportToPDF(params);
            const fileName = `reporte-${filtros.tipo_reporte}-${filtros.periodo}.pdf`;
            downloadFile(blob, fileName);
        } catch (error) {
            console.error('Error al exportar a PDF:', error);
            setExportError('Error al generar el reporte PDF');
        } finally {
            setLoading(false);
        }
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
                                className={`${styles.tipoButton} ${filtros.tipo_reporte === tipo.id ? styles.active : ''}`}
                                onClick={() => setFiltros(prev => ({ ...prev, tipo_reporte: tipo.id as FiltrosReporte['tipo_reporte'] }))}
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
                                className={`${styles.tipoButton} ${filtros.periodo === periodo.id ? styles.active : ''}`}
                                onClick={() => setFiltros(prev => ({ ...prev, periodo: periodo.id as FiltrosReporte['periodo'] }))}
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
                                    <button
                                        key={sucursal.id_sucursal}
                                        className={`${styles.sucursalCard} ${filtros.sucursal === sucursal.id_sucursal ? styles.selected : ''}`}
                                        onClick={() => setFiltros(prev => ({ ...prev, sucursal: sucursal.id_sucursal }))}
                                        type="button"
                                    >
                                        <h4>{sucursal.nombre}</h4>
                                    </button>
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
                    disabled={loading}
                >
                    {loading ? 'Generando Excel...' : 'Exportar a Excel'}
                </button>
                <button
                    onClick={handleExportPDF}
                    className={`${styles.exportButton} ${styles.pdfButton}`}
                    disabled={loading}
                >
                    {loading ? 'Generando PDF...' : 'Exportar a PDF'}
                </button>
            </div>
            {exportError && (
                <div className={styles.errorMessage}>
                    {exportError}
                </div>
            )}
        </div>
    );
};