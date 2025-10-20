import React, { useState, useEffect, useCallback } from 'react';
import styles from './ProveedorList.module.css';
import { proveedorService } from '../../services/proveedorService';
import type { Proveedor } from '../../types/proveedor';

interface ProveedorListProps {
    onRefresh?: () => void;
}

export const ProveedorList = ({ onRefresh }: ProveedorListProps) => {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingProveedor, setLoadingProveedor] = useState<number | null>(null);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const loadProveedores = useCallback(async (params?: { search?: string }) => {
        try {
            setLoading(true);
            const response = await proveedorService.getProveedores(params);
            setProveedores(response.proveedores);
            setTotal(response.total);
            setError(null);
            onRefresh?.();
        } catch (err) {
            setError('Error al cargar proveedores');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [onRefresh]);

    useEffect(() => {
        loadProveedores();
    }, [loadProveedores]);

    const handleToggleStatus = async (proveedor: Proveedor) => {
        try {
            setLoadingProveedor(proveedor.id_proveedor);
            setError(null);
            await proveedorService.toggleProveedorStatus(proveedor.id_proveedor);
            await loadProveedores();
        } catch (err) {
            console.error('Error al cambiar estado:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error al cambiar el estado del proveedor');
            }
        } finally {
            setLoadingProveedor(null);
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loadProveedores({ search: searchTerm });
    };

    const renderTableContent = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={7} className={styles.messageCell}>
                        <div className={styles.loadingMessage}>
                            Cargando proveedores...
                        </div>
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={7} className={styles.messageCell}>
                        <div className={styles.errorMessage}>
                            {error}
                            <button 
                                onClick={() => loadProveedores()}
                                className={styles.retryButton}
                            >
                                Reintentar
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }

        if (proveedores.length === 0) {
            return (
                <tr>
                    <td colSpan={7} className={styles.messageCell}>
                        <div className={styles.emptyMessage}>
                            No hay proveedores registrados
                        </div>
                    </td>
                </tr>
            );
        }

        return proveedores.map(proveedor => (
            <tr key={proveedor.id_proveedor} className={styles.tableRow}>
                <td className={styles.tableCell}>{proveedor.nombre}</td>
                <td className={styles.tableCell}>{proveedor.contacto}</td>
                <td className={styles.tableCell}>{proveedor.email}</td>
                <td className={styles.tableCell}>{proveedor.telefono}</td>
                <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${proveedor.activo ? styles.statusActive : styles.statusInactive}`}>
                        {proveedor.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                        <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => {/* TODO: Implementar edición */}}
                            title="Editar proveedor"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => handleToggleStatus(proveedor)}
                            className={`${styles.actionButton} ${proveedor.activo ? styles.deleteButton : styles.activateButton}`}
                            disabled={loadingProveedor === proveedor.id_proveedor}
                            title={proveedor.activo ? 'Desactivar proveedor' : 'Activar proveedor'}
                        >
                            {loadingProveedor === proveedor.id_proveedor ? 'Procesando...' : 
                             proveedor.activo ? 'Desactivar' : 'Activar'}
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSearch} className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar proveedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                    Buscar
                </button>
            </form>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.tableHeader}>Proveedor</th>
                        <th className={styles.tableHeader}>Contacto</th>
                        <th className={styles.tableHeader}>Email</th>
                        <th className={styles.tableHeader}>Teléfono</th>
                        <th className={styles.tableHeader}>Estado</th>
                        <th className={styles.tableHeader}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableContent()}
                </tbody>
            </table>
            <div className={styles.footer}>
                Total de proveedores: {total}
            </div>
        </div>
    )
};