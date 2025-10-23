import axios from "axios";
import type {
  Producto,
  ProductoUpdate,
  GetProductosParams,
  ProductoListResponse,
} from "../types/producto";

const BASE_URL = "http://localhost:8000/api/products";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const productoService = {
  getProductos: async (
    params?: GetProductosParams
  ): Promise<ProductoListResponse> => {
    try {
      const { data } = await axios.get(`${BASE_URL}/ListarProductos`, {
        headers: getAuthHeaders(),
        params: {
          ...params,
          skip: params?.skip || 0,
          limit: params?.limit || 15,
        },
      });
      console.log('Respuesta completa del servidor:', {
        productos: data.productos,
        total: data.total,
        muestra: data.productos?.[0] // Mostrar el primer producto como ejemplo
      });

      // Procesar y ordenar los productos
      const productosOrdenados = data.productos
        .map((producto: Producto): Producto => ({
          ...producto,
          stock_actual: parseFloat(producto.stock_actual as unknown as string),
          stock_minimo: parseFloat(producto.stock_minimo as unknown as string),
          precio: parseFloat(producto.precio as unknown as string)
        }))
        .sort((a: Producto, b: Producto) => a.id_producto - b.id_producto);

      return {
        productos: productosOrdenados,
        total: data.total
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error detallado:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        throw new Error(error.response.data.detail || 'Error al obtener productos');
      }
      throw error;
    }
  },

  getProductoById: async (id: number): Promise<Producto> => {
    try {
      const { data } = await axios.get(`${BASE_URL}/obtenerProducto/${id}`, {
        headers: getAuthHeaders()
      });
      console.log('Respuesta obtenerProducto:', data);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error al obtener producto:', error.response.data);
        throw new Error(error.response.data.detail || 'Error al obtener producto');
      }
      throw error;
    }
  },

  createProducto: async (productoData: ProductoUpdate): Promise<Producto> => {
    try {
      console.log('Datos enviados al crear producto:', productoData);
      
      // Separar el id_proveedor de los datos del producto
      const { id_proveedor, ...productoInfo } = productoData;
      
      // Primero crear el producto
      const { data } = await axios.post(
        `${BASE_URL}/crearProducto`,
        {
          ...productoInfo,
          id_proveedor // Enviamos el id del proveedor directamente
        },
        {
          headers: getAuthHeaders(),
        }
      );
      
      console.log('Respuesta del servidor:', data);
      return data;
    } catch (error) {
      console.error('Error completo:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data,
            headers: error.config?.headers
          }
        });
        throw new Error(error.response?.data?.detail || 'Error al crear producto');
      }
      throw error;
    }
  },

  updateProducto: async (
    id: number,
    productoData: ProductoUpdate
  ): Promise<Producto> => {
    try {
      console.warn('🔄 [ProductoService] Datos a enviar:', JSON.stringify(productoData, null, 2));
      
      console.warn('🚀 [ProductoService] Datos a enviar:', {
        url: `${BASE_URL}/actualizarProducto/${id}`,
        data: productoData,
        campos_presentes: Object.keys(productoData),
        tiene_id_proveedor: Object.keys(productoData).includes('id_proveedor')
      });

      // Enviar todos los datos directamente
      const { data } = await axios.put(
        `${BASE_URL}/actualizarProducto/${id}`,
        productoData,
        {
          headers: getAuthHeaders()
        }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error al actualizar producto:', error.response.data);
        throw new Error(error.response.data.detail || 'Error al actualizar producto');
      }
      throw error;
    }
  },

  toggleProductoStatus: async (id: number): Promise<Producto> => {
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/cambiarEstadoProducto/${id}`,
        {},
        {
          headers: getAuthHeaders()
        }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error al cambiar estado del producto:', error.response.data);
        throw new Error(error.response.data.detail || 'Error al cambiar estado del producto');
      }
      throw error;
    }
  },
};
