import { useState, useEffect, useCallback } from 'react';
import styles from './ProductList.module.css';
import { productoService } from '../../services/productoService';
import type { Producto } from '../../types/producto';
import { EditProductModal } from './EditProductModal';

interface ProductListProps {
    onRefresh?: () => void;
}

export const ProductList = ({ onRefresh }: ProductListProps) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingProducto, setLoadingProducto] = useState<number | null>(null);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const itemsPerPage = 15;

    const loadProductos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await productoService.getProductos({
                search: searchTerm,
                skip: (currentPage - 1) * itemsPerPage,
                limit: itemsPerPage
            });
            
            setProductos(response.productos);
            setTotal(response.total);
            setError(null);
            onRefresh?.();
        } catch (err) {
            setError('Error al cargar productos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, itemsPerPage, onRefresh]);

    useEffect(() => {
        loadProductos();
    }, [loadProductos]);

    const handleToggleStatus = async (producto: Producto) => {
        // Si ya hay una operación en curso para este producto, no hacer nada
        if (loadingProducto === producto.id_producto) return;

        try {
            setLoadingProducto(producto.id_producto);
            setError(null);
            
            // Obtener el producto actualizado del servidor
            const updatedProducto = await productoService.toggleProductoStatus(producto.id_producto);
            
            // Actualizar solo el producto específico con los datos del servidor
            setProductos(prevProductos => 
                prevProductos.map(p => 
                    p.id_producto === producto.id_producto
                        ? { ...p, activo: updatedProducto.activo }
                        : p
                )
            );
        } catch (err) {
            console.error('Error al cambiar estado:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error al cambiar el estado del producto');
            }
        } finally {
            setLoadingProducto(null);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const renderTableContent = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={9} className={styles.messageCell}>
                        <div className={styles.loadingMessage}>
                            Cargando productos...
                        </div>
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={9} className={styles.messageCell}>
                        <div className={styles.errorMessage}>
                            {error}
                            <button 
                                onClick={loadProductos}
                                className={styles.retryButton}
                            >
                                Reintentar
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }

        if (!productos || productos.length === 0) {
            return (
                <tr>
                    <td colSpan={9} className={styles.messageCell}>
                        <div className={styles.emptyMessage}>
                            No hay productos registrados
                        </div>
                    </td>
                </tr>
            );
        }

        return productos.map(producto => (
            <tr key={producto.id_producto} className={styles.tableRow}>
                <td className={styles.tableCell}>{producto.codigo_producto}</td>
                <td className={styles.tableCell}>{producto.nombre}</td>
                <td className={styles.tableCell}>
                    <span className={styles.categoryBadge}>
                        {producto.categoria_nombre || 'Sin categoría'}
                    </span>
                </td>
                <td className={styles.tableCell}>
                    <span className={styles.brandBadge}>
                        {producto.marca_nombre || 'Sin marca'}
                    </span>
                </td>
                <td className={styles.tableCell}>
                    <span className={styles.proveedorBadge}>
                        {producto.proveedor_nombre || 'Sin proveedor'}
                    </span>
                </td>
                <td className={styles.tableCell}>{producto.stock_actual}</td>
                <td className={styles.tableCell}>S/ {Number(producto.precio || 0).toFixed(2)}</td>
                <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${producto.activo ? styles.statusActive : styles.statusInactive}`}>
                        {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                        <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => {
                                setSelectedProducto(producto);
                                setEditModalOpen(true);
                            }}
                            title="Editar producto"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => handleToggleStatus(producto)}
                            className={`${styles.actionButton} ${producto.activo ? styles.deleteButton : styles.activateButton}`}
                            disabled={loadingProducto === producto.id_producto}
                            title={producto.activo ? 'Desactivar producto' : 'Activar producto'}
                        >
                            {loadingProducto === producto.id_producto ? 'Procesando...' : 
                             producto.activo ? 'Desactivar' : 'Activar'}
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Marca</th>
                            <th>Proveedor</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableContent()}
                    </tbody>
                </table>
            </div>

            <div className={styles.paginationContainer}>
                <div className={styles.paginationInfo}>
                    Mostrando {productos?.length || 0} de {total} productos
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
                        Página {currentPage} de {Math.max(1, Math.ceil(total / itemsPerPage))}
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

            {selectedProducto && (
                <EditProductModal
                    isOpen={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedProducto(null);
                    }}
                    onSuccess={(productoActualizado) => {
                        setProductos(prevProductos => 
                            prevProductos.map(p => 
                                p.id_producto === productoActualizado.id_producto
                                    ? productoActualizado
                                    : p
                            )
                        );
                        setEditModalOpen(false);
                        setSelectedProducto(null);
                    }}
                    producto={selectedProducto}
                />
            )}
        </div>
    );
};