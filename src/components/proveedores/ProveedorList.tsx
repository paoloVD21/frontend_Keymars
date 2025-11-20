import React, { useState, useEffect, useCallback } from 'react';
import styles from './ProveedorList.module.css';
import { proveedorService } from '../../services/proveedorService';
import type { Proveedor } from '../../types/proveedor';
import { EditProveedorModal } from './EditProveedorModal';

interface ProveedorListProps {
    onRefresh?: () => void;
    userRole: 'supervisor' | 'asistente';
}

export const ProveedorList = ({ onRefresh, userRole }: ProveedorListProps) => {
    const isSupervisor = userRole === 'supervisor';
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingProveedor, setLoadingProveedor] = useState<number | null>(null);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
    const itemsPerPage = 10;

    const loadProveedores = useCallback(async (params?: { search?: string, skip?: number, limit?: number }) => {
        try {
            setLoading(true);
            const response = await proveedorService.getProveedores({
                ...params,
                skip: (currentPage - 1) * itemsPerPage,
                limit: itemsPerPage
            });
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
    }, [currentPage, onRefresh]);

    useEffect(() => {
        loadProveedores({ search: searchTerm });
    }, [loadProveedores, searchTerm]);

    const handleToggleStatus = async (proveedor: Proveedor) => {
        try {
            setLoadingProveedor(proveedor.id_proveedor);
            setError(null);
            await proveedorService.toggleProveedorStatus(proveedor.id_proveedor);
            
            // Actualizar solo el proveedor modificado en la lista
            setProveedores(prevProveedores => 
                prevProveedores.map(p => 
                    p.id_proveedor === proveedor.id_proveedor
                        ? { ...p, activo: !p.activo }
                        : p
                )
            );
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
        setCurrentPage(1); // Resetear a la primera página
        loadProveedores({ search: searchTerm });
    };

    const renderTableContent = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={isSupervisor ? 6 : 5} className={styles.messageCell}>
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
                    <td colSpan={isSupervisor ? 6 : 5} className={styles.messageCell}>
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
                    <td colSpan={isSupervisor ? 6 : 5} className={styles.messageCell}>
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
                {isSupervisor && (
                    <td className={styles.tableCell}>
                        <div className={styles.actionButtons}>
                            <button
                                className={`${styles.actionButton} ${styles.editButton}`}
                                onClick={() => {
                                    setSelectedProveedor(proveedor);
                                    setEditModalOpen(true);
                                }}
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
                                {loadingProveedor === proveedor.id_proveedor 
                                    ? 'Procesando...' 
                                    : proveedor.activo 
                                        ? 'Desactivar' 
                                        : 'Activar'}
                            </button>
                        </div>
                    </td>
                )}
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
            </form>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Proveedor</th>
                            <th>Contacto</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            {isSupervisor && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableContent()}
                    </tbody>
                </table>
            </div>
            <div className={styles.paginationContainer}>
                <div className={styles.paginationInfo}>
                    Mostrando {proveedores.length} de {total} proveedores
                </div>
                <div className={styles.paginationButtons}>
                    <button
                        className={styles.paginationButton}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || loading}
                    >
                        Anterior
                    </button>
                    <span className={styles.paginationInfo}>
                        Página {currentPage} de {Math.ceil(total / itemsPerPage)}
                    </span>
                    <button
                        className={styles.paginationButton}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(total / itemsPerPage)))}
                        disabled={currentPage >= Math.ceil(total / itemsPerPage) || loading}
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {selectedProveedor && (
                <EditProveedorModal
                    isOpen={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedProveedor(null);
                    }}
                    onSuccess={(proveedorActualizado) => {
                        // Actualizar solo el proveedor editado en la lista
                        setProveedores(prevProveedores => 
                            prevProveedores.map(p => 
                                p.id_proveedor === proveedorActualizado.id_proveedor
                                    ? proveedorActualizado
                                    : p
                            )
                        );
                        setEditModalOpen(false);
                        setSelectedProveedor(null);
                    }}
                    proveedor={selectedProveedor}
                />
            )}
        </div>
    )
};