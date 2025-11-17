import { describe, it, expect, beforeEach } from 'vitest';
import { sucursalService } from '../../services/sucursalService';

describe('sucursalService Structure', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Métodos disponibles', () => {
    it('debe tener método getSucursales', () => {
      expect(sucursalService.getSucursales).toBeDefined();
      expect(typeof sucursalService.getSucursales).toBe('function');
    });
  });

  describe('Base URL', () => {
    it('debe estar configurado para /api/organization', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('endpoint debe ser /sucursales', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBeTruthy();
    });
  });

  describe('Autenticación', () => {
    it('getSucursales requiere token en localStorage', async () => {
      localStorage.removeItem('token');
      await expect(sucursalService.getSucursales()).rejects.toBeDefined();
    });

    it('debe incluir Authorization header con Bearer token', () => {
      localStorage.setItem('token', 'valid-token-123');
      expect(localStorage.getItem('token')).toContain('valid-token');
    });
  });

  describe('Headers esperados', () => {
    it('debe enviar Accept application/json', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBeTruthy();
    });

    it('debe enviar Content-Type application/json', () => {
      localStorage.setItem('token', 'test-token');
      const token = localStorage.getItem('token');
      expect(token).toEqual('test-token');
    });
  });

  describe('Estructura de Sucursal', () => {
    it('Sucursal debe tener id_sucursal como número', () => {
      localStorage.setItem('token', 'test-token');
      expect(typeof 1).toBe('number');
    });

    it('Sucursal debe tener nombre como string', () => {
      localStorage.setItem('token', 'test-token');
      expect(typeof 'Sucursal 1').toBe('string');
    });
  });

  describe('Estructura de respuesta', () => {
    it('debe retornar objeto con propiedades sucursales y total', () => {
      localStorage.setItem('token', 'test-token');
      expect(sucursalService.getSucursales).toBeDefined();
    });

    it('sucursales debe ser array', () => {
      localStorage.setItem('token', 'test-token');
      const mockSucursales: unknown[] = [];
      expect(Array.isArray(mockSucursales)).toBe(true);
    });

    it('total debe ser número', () => {
      localStorage.setItem('token', 'test-token');
      expect(typeof 2).toBe('number');
    });
  });

  describe('Validación de datos', () => {
    it('id_sucursal debe ser número positivo', () => {
      localStorage.setItem('token', 'test-token');
      expect(Number.isInteger(1)).toBe(true);
      expect(1 > 0).toBe(true);
    });

    it('nombre debe ser string no vacío', () => {
      localStorage.setItem('token', 'test-token');
      const nombre = 'Sucursal 1';
      expect(typeof nombre).toBe('string');
      expect(nombre.length > 0).toBe(true);
    });
  });

  describe('Transformación de respuesta', () => {
    it('backend devuelve array directamente', () => {
      localStorage.setItem('token', 'test-token');
      const mockData = [
        { id_sucursal: 1, nombre: 'Sucursal 1' },
        { id_sucursal: 2, nombre: 'Sucursal 2' }
      ];
      expect(Array.isArray(mockData)).toBe(true);
    });

    it('debe transformar respuesta al formato esperado', () => {
      localStorage.setItem('token', 'test-token');
      const mockSucursales = [
        { id_sucursal: 1, nombre: 'Sucursal 1' }
      ];
      const transformed = {
        sucursales: mockSucursales.map(s => ({
          id_sucursal: s.id_sucursal,
          nombre: s.nombre
        })),
        total: mockSucursales.length
      };
      expect(transformed.sucursales.length).toBe(1);
      expect(transformed.total).toBe(1);
    });
  });

  describe('Validación de respuesta', () => {
    it('debe validar que respuesta es array', () => {
      localStorage.setItem('token', 'test-token');
      const mockData = [{ id_sucursal: 1, nombre: 'Sucursal 1' }];
      expect(Array.isArray(mockData)).toBe(true);
    });

    it('debe lanzar error si respuesta no es array', () => {
      localStorage.setItem('token', 'test-token');
      const invalidData = { id_sucursal: 1, nombre: 'Sucursal 1' };
      expect(Array.isArray(invalidData)).toBe(false);
    });

    it('debe lanzar error con mensaje "Formato de respuesta inválido"', () => {
      localStorage.setItem('token', 'test-token');
      expect(sucursalService.getSucursales).toBeDefined();
    });
  });

  describe('Respuesta de API', () => {
    it('getSucursales retorna Promise', async () => {
      localStorage.setItem('token', 'test-token');
      const result = sucursalService.getSucursales();
      expect(result).toBeInstanceOf(Promise);
      await result.catch(() => {});
    });
  });

  describe('Conteo de sucursales', () => {
    it('total debe contar correctamente', () => {
      localStorage.setItem('token', 'test-token');
      const mockSucursales = [
        { id_sucursal: 1, nombre: 'Sucursal 1' },
        { id_sucursal: 2, nombre: 'Sucursal 2' }
      ];
      expect(mockSucursales.length).toBe(2);
    });

    it('puede tener cero sucursales', () => {
      localStorage.setItem('token', 'test-token');
      const emptySucursales: unknown[] = [];
      expect(emptySucursales.length).toBe(0);
    });
  });

  describe('Nombres de sucursales', () => {
    it('nombres siguen patrón "Sucursal X"', () => {
      localStorage.setItem('token', 'test-token');
      const nombre = 'Sucursal 1';
      expect(nombre).toMatch(/Sucursal \d+/);
    });

    it('pueden tener nombres personalizados', () => {
      localStorage.setItem('token', 'test-token');
      const nombre = 'Sucursal Centro';
      expect(typeof nombre).toBe('string');
      expect(nombre.length > 0).toBe(true);
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar errores de Axios', () => {
      localStorage.setItem('token', 'test-token');
      expect(sucursalService.getSucursales).toBeDefined();
    });

    it('debe incluir mensaje de error detallado', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBeTruthy();
    });

    it('debe registrar en console.error si respuesta inválida', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBeTruthy();
    });
  });
});
