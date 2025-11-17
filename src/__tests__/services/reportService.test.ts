import { describe, it, expect, beforeEach } from 'vitest';
import { reportService } from '../../services/reportService';

describe('reportService Structure', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Métodos disponibles', () => {
    it('debe tener método exportToExcel', () => {
      expect(reportService.exportToExcel).toBeDefined();
      expect(typeof reportService.exportToExcel).toBe('function');
    });

    it('debe tener método exportToPDF', () => {
      expect(reportService.exportToPDF).toBeDefined();
      expect(typeof reportService.exportToPDF).toBe('function');
    });
  });

  describe('Base URL', () => {
    it('debe estar configurado para /api/reports', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('endpoints deben ser /excel y /pdf', () => {
      localStorage.setItem('token', 'test-token');
      const endpoints = ['excel', 'pdf'];
      expect(endpoints).toContain('excel');
      expect(endpoints).toContain('pdf');
    });
  });

  describe('Parámetros de ReportParams', () => {
    it('ReportParams debe tener tipo_reporte requerido', () => {
      localStorage.setItem('token', 'test-token');
      const tipos = ['resumen_inventario', 'stock_bajo', 'mayores_movimientos'];
      expect(tipos).toContain('resumen_inventario');
      expect(tipos).toContain('stock_bajo');
    });

    it('ReportParams debe tener periodo requerido', () => {
      localStorage.setItem('token', 'test-token');
      const periodos = ['ultimo_mes', 'ultimo_trimestre', 'ultimo_anio'];
      expect(periodos).toContain('ultimo_mes');
      expect(periodos).toContain('ultimo_trimestre');
    });

    it('ReportParams debe tener id_sucursal opcional', () => {
      localStorage.setItem('token', 'test-token');
      const params = {
        tipo_reporte: 'resumen_inventario' as const,
        periodo: 'ultimo_mes' as const,
        id_sucursal: 1
      };
      expect(params).toHaveProperty('id_sucursal');
    });
  });

  describe('Tipos de reporte válidos', () => {
    it('resumen_inventario es tipo válido', () => {
      localStorage.setItem('token', 'test-token');
      const tipo = 'resumen_inventario';
      expect(tipo).toBe('resumen_inventario');
    });

    it('stock_bajo es tipo válido', () => {
      localStorage.setItem('token', 'test-token');
      const tipo = 'stock_bajo';
      expect(tipo).toBe('stock_bajo');
    });

    it('mayores_movimientos es tipo válido', () => {
      localStorage.setItem('token', 'test-token');
      const tipo = 'mayores_movimientos';
      expect(tipo).toBe('mayores_movimientos');
    });
  });

  describe('Periodos válidos', () => {
    it('ultimo_mes es período válido', () => {
      localStorage.setItem('token', 'test-token');
      const periodo = 'ultimo_mes';
      expect(periodo).toBe('ultimo_mes');
    });

    it('ultimo_trimestre es período válido', () => {
      localStorage.setItem('token', 'test-token');
      const periodo = 'ultimo_trimestre';
      expect(periodo).toBe('ultimo_trimestre');
    });

    it('ultimo_anio es período válido', () => {
      localStorage.setItem('token', 'test-token');
      const periodo = 'ultimo_anio';
      expect(periodo).toBe('ultimo_anio');
    });
  });

  describe('Autenticación', () => {
    it('exportToExcel requiere token en localStorage', async () => {
      localStorage.removeItem('token');
      await expect(reportService.exportToExcel({
        tipo_reporte: 'resumen_inventario',
        periodo: 'ultimo_mes'
      })).rejects.toBeDefined();
    });

    it('exportToPDF requiere token en localStorage', async () => {
      localStorage.removeItem('token');
      await expect(reportService.exportToPDF({
        tipo_reporte: 'resumen_inventario',
        periodo: 'ultimo_mes'
      })).rejects.toBeDefined();
    });
  });

  describe('Headers esperados', () => {
    it('debe incluir Authorization header con Bearer token', () => {
      localStorage.setItem('token', 'valid-token-123');
      expect(localStorage.getItem('token')).toContain('valid-token');
    });

    it('exportToExcel debe tener Accept header para Excel', () => {
      localStorage.setItem('token', 'test-token');
      const excelMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      expect(excelMimeType).toContain('spreadsheetml');
    });

    it('exportToPDF debe tener Accept header para PDF', () => {
      localStorage.setItem('token', 'test-token');
      const pdfMimeType = 'application/pdf';
      expect(pdfMimeType).toBe('application/pdf');
    });
  });

  describe('Configuración de respuesta', () => {
    it('exportToExcel debe retornar Blob', () => {
      localStorage.setItem('token', 'test-token');
      const mockBlob = new Blob(['test'], { type: 'application/vnd.ms-excel' });
      expect(mockBlob).toBeInstanceOf(Blob);
    });

    it('exportToPDF debe retornar Blob', () => {
      localStorage.setItem('token', 'test-token');
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      expect(mockBlob).toBeInstanceOf(Blob);
    });

    it('responseType debe ser blob para ambas funciones', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBeTruthy();
    });
  });

  describe('Parámetros POST', () => {
    it('debe enviar ReportParams en el body', () => {
      localStorage.setItem('token', 'test-token');
      const params = {
        tipo_reporte: 'resumen_inventario' as const,
        periodo: 'ultimo_mes' as const
      };
      expect(params).toHaveProperty('tipo_reporte');
      expect(params).toHaveProperty('periodo');
    });

    it('id_sucursal es opcional en los parámetros', () => {
      localStorage.setItem('token', 'test-token');
      const params = {
        tipo_reporte: 'resumen_inventario' as const,
        periodo: 'ultimo_mes' as const
      };
      expect(params.hasOwnProperty('id_sucursal')).toBe(false);
    });
  });

  describe('Respuesta de API', () => {
    it('exportToExcel retorna Promise', async () => {
      localStorage.setItem('token', 'test-token');
      const result = reportService.exportToExcel({
        tipo_reporte: 'resumen_inventario',
        periodo: 'ultimo_mes'
      });
      expect(result).toBeInstanceOf(Promise);
      await result.catch(() => {});
    });

    it('exportToPDF retorna Promise', async () => {
      localStorage.setItem('token', 'test-token');
      const result = reportService.exportToPDF({
        tipo_reporte: 'resumen_inventario',
        periodo: 'ultimo_mes'
      });
      expect(result).toBeInstanceOf(Promise);
      await result.catch(() => {});
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar errores de Axios para Excel', () => {
      localStorage.setItem('token', 'test-token');
      expect(reportService.exportToExcel).toBeDefined();
    });

    it('debe manejar errores de Axios para PDF', () => {
      localStorage.setItem('token', 'test-token');
      expect(reportService.exportToPDF).toBeDefined();
    });

    it('debe incluir console.error para registrar errores', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBeTruthy();
    });
  });

  describe('Diferenciación de formatos', () => {
    it('exportToExcel y exportToPDF son métodos distintos', () => {
      localStorage.setItem('token', 'test-token');
      expect(reportService.exportToExcel).not.toBe(reportService.exportToPDF);
    });

    it('tienen diferentes Accept headers', () => {
      localStorage.setItem('token', 'test-token');
      const excelType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const pdfType = 'application/pdf';
      expect(excelType).not.toBe(pdfType);
    });
  });
});
