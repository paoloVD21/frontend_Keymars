import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSucursales } from '../../hooks/useSucursales';

// Mock del sucursalService
vi.mock('../../services/sucursalService', () => ({
  sucursalService: {
    getSucursales: vi.fn()
  }
}));

import { sucursalService } from '../../services/sucursalService';

describe('useSucursales Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Estado inicial', () => {
    it('debe inicializar con sucursales vacío', async () => {
      const { result } = renderHook(() => useSucursales());
      await waitFor(() => {
        expect(result.current.sucursales).toEqual([]);
      });
    });

    it('debe inicializar con isLoading en true', async () => {
      const { result } = renderHook(() => useSucursales());
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });
    });

    it('debe inicializar con error en null', async () => {
      const { result } = renderHook(() => useSucursales());
      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('Retorna objeto con propiedades correctas', () => {
    it('debe retornar objeto con sucursales, isLoading y error', async () => {
      const { result } = renderHook(() => useSucursales());
      await waitFor(() => {
        expect(result.current).toHaveProperty('sucursales');
        expect(result.current).toHaveProperty('isLoading');
        expect(result.current).toHaveProperty('error');
      });
    });

    it('sucursales debe ser array', async () => {
      const { result } = renderHook(() => useSucursales());
      await waitFor(() => {
        expect(Array.isArray(result.current.sucursales)).toBe(true);
      });
    });

    it('isLoading debe ser boolean', async () => {
      const { result } = renderHook(() => useSucursales());
      await waitFor(() => {
        expect(typeof result.current.isLoading).toBe('boolean');
      });
    });

    it('error debe ser null o string', async () => {
      const { result } = renderHook(() => useSucursales());
      await waitFor(() => {
        expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
      });
    });
  });

  describe('Carga exitosa de sucursales', () => {
    it('debe llamar a sucursalService.getSucursales', async () => {
      vi.mocked(sucursalService.getSucursales).mockResolvedValue({
        sucursales: [],
        total: 0
      });

      renderHook(() => useSucursales());

      await waitFor(() => {
        expect(sucursalService.getSucursales).toHaveBeenCalled();
      });
    });

    it('debe actualizar sucursales cuando se cargan', async () => {
      const mockSucursales = [
        { id_sucursal: 1, nombre: 'Sucursal 1' },
        { id_sucursal: 2, nombre: 'Sucursal 2' }
      ];

      vi.mocked(sucursalService.getSucursales).mockResolvedValue({
        sucursales: mockSucursales,
        total: 2
      });

      const { result } = renderHook(() => useSucursales());

      await waitFor(() => {
        expect(result.current.sucursales).toEqual(mockSucursales);
      });
    });

    it('debe cambiar isLoading a false después de cargar', async () => {
      vi.mocked(sucursalService.getSucursales).mockResolvedValue({
        sucursales: [],
        total: 0
      });

      const { result } = renderHook(() => useSucursales());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('debe mantener error en null si carga exitosa', async () => {
      vi.mocked(sucursalService.getSucursales).mockResolvedValue({
        sucursales: [],
        total: 0
      });

      const { result } = renderHook(() => useSucursales());

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('Manejo de errores', () => {
    it('debe capturar Error y asignar mensaje a error', async () => {
      const errorMessage = 'Error al cargar las sucursales';
      vi.mocked(sucursalService.getSucursales).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useSucursales());

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });

    it('debe asignar mensaje genérico si error no es Error', async () => {
      vi.mocked(sucursalService.getSucursales).mockRejectedValue('Error desconocido');

      const { result } = renderHook(() => useSucursales());

      await waitFor(() => {
        expect(result.current.error).toBe('Error al cargar las sucursales');
      });
    });

    it('debe cambiar isLoading a false incluso si hay error', async () => {
      vi.mocked(sucursalService.getSucursales).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useSucursales());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('debe mantener sucursales vacío si hay error', async () => {
      vi.mocked(sucursalService.getSucursales).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useSucursales());

      await waitFor(() => {
        expect(result.current.sucursales).toEqual([]);
      });
    });
  });

  describe('Dependencias del useEffect', () => {
    it('debe ejecutarse solo una vez al montar', async () => {
      vi.mocked(sucursalService.getSucursales).mockResolvedValue({
        sucursales: [],
        total: 0
      });

      const { rerender } = renderHook(() => useSucursales());

      await waitFor(() => {
        expect(sucursalService.getSucursales).toHaveBeenCalledTimes(1);
      });

      rerender();

      await waitFor(() => {
        expect(sucursalService.getSucursales).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Tipos de datos esperados', () => {
    it('cada sucursal debe tener id_sucursal número', async () => {
      const mockSucursales = [
        { id_sucursal: 1, nombre: 'Sucursal 1' }
      ];

      vi.mocked(sucursalService.getSucursales).mockResolvedValue({
        sucursales: mockSucursales,
        total: 1
      });

      const { result } = renderHook(() => useSucursales());

      await waitFor(() => {
        expect(Number.isInteger(result.current.sucursales[0].id_sucursal)).toBe(true);
      });
    });

    it('cada sucursal debe tener nombre string', async () => {
      const mockSucursales = [
        { id_sucursal: 1, nombre: 'Sucursal 1' }
      ];

      vi.mocked(sucursalService.getSucursales).mockResolvedValue({
        sucursales: mockSucursales,
        total: 1
      });

      const { result } = renderHook(() => useSucursales());

      await waitFor(() => {
        expect(typeof result.current.sucursales[0].nombre).toBe('string');
      });
    });
  });
});
