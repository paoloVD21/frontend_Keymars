import React, { useState, useEffect, useCallback } from 'react';
import styles from './ProveedorList.module.css';
import { CreateProveedorModal } from './CreateProveedorModal';
import { proveedorService } from '../../services/proveedorService';
import type { Proveedor } from '../../types/proveedor';

interface ProveedorListProps {
    onRefresh?: () => void;
}

export const ProveedorList = ({ onRefresh }: ProveedorListProps) => {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

    const handleCreateProveedor = () => {
        setIsCreateModalOpen(true);
    };

    const handleProveedorCreated = () => {
        loadProveedores();
    };

    const handleToggleStatus = async (proveedor: Proveedor) => {
        try {
            setLoadingProveedor(proveedor.id_proveedor);
            setError(null);
            await proveedorService.toggleProveedorStatus(proveedor.id_proveedor, !proveedor.activo);
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
                    <td colSpan={6} className={styles.messageCell}>
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
                    <td colSpan={6} className={styles.messageCell}>
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
                    <td colSpan={6} className={styles.messageCell}>
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
                <td className={styles.tableCell}>{proveedor.email}</td>
                <td className={styles.tableCell}>{proveedor.telefono}</td>
                <td className={styles.tableCell}>{proveedor.direccion}</td>
                <td className={styles.tableCell}>
                    <span className={proveedor.activo ? styles.statusActive : styles.statusInactive}>
                        {proveedor.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td className={styles.tableCell}>
                    <div className={styles.actions}>
                        <button
                            onClick={() => handleToggleStatus(proveedor)}
                            className={`${styles.statusButton} ${proveedor.activo ? styles.deactivateButton : styles.activateButton}`}
                            disabled={loadingProveedor === proveedor.id_proveedor}
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
            <div className={styles.header}>
                <h2 className={styles.title}>Proveedores</h2>
                <button
                    onClick={handleCreateProveedor}
                    className={styles.createButton}
                >
                    Nuevo Proveedor
                </button>
            </div>

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
                        <th className={styles.tableHeader}>Nombre</th>
                        <th className={styles.tableHeader}>Email</th>
                        <th className={styles.tableHeader}>Teléfono</th>
                        <th className={styles.tableHeader}>Dirección</th>
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

            {isCreateModalOpen && (
                <CreateProveedorModal 
                    isOpen={true}
                    onClose={() => setIsCreateModalOpen(false)}
                    onProveedorCreated={handleProveedorCreated}
                />
            )}
        </div>
    )
};