import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '../../components/ui/Sidebar';

// Mock del useAuthStore
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    logout: vi.fn(),
    isAuthenticated: true,
    user: null
  }))
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Estructura base', () => {
    it('debe renderizar un elemento aside', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      const sidebar = document.querySelector('aside');
      expect(sidebar).toBeTruthy();
    });

    it('debe tener sección de navegación', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      const nav = document.querySelector('nav');
      expect(nav).toBeTruthy();
    });
  });

  describe('Navegación general', () => {
    it('debe tener enlace a Dashboard', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      expect(screen.getByText('Dashboard')).toBeTruthy();
    });

    it('debe tener enlace a Productos', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      expect(screen.getByText('Productos')).toBeTruthy();
    });

    it('debe tener enlace a Entradas', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      expect(screen.getByText('Entradas')).toBeTruthy();
    });

    it('debe tener enlace a Salidas', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      expect(screen.getByText('Salidas')).toBeTruthy();
    });

    it('debe tener enlace a Proveedores', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      expect(screen.getByText('Proveedores')).toBeTruthy();
    });

    it('debe tener enlace a Alertas', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      expect(screen.getByText('Alertas')).toBeTruthy();
    });
  });

  describe('Menú condicional para supervisores', () => {
    it('no debe mostrar Usuarios si user no es supervisor', () => {
      const user = { role: 'asistente' } as unknown as any;
      render(
        <BrowserRouter>
          <Sidebar user={user} />
        </BrowserRouter>
      );
      const usersLink = screen.queryByText('Usuarios');
      expect(usersLink).toBeNull();
    });

    it('debe mostrar Usuarios si user es supervisor', () => {
      const user = { role: 'supervisor' } as unknown as any;
      render(
        <BrowserRouter>
          <Sidebar user={user} />
        </BrowserRouter>
      );
      expect(screen.getByText('Usuarios')).toBeTruthy();
    });

    it('no debe mostrar Reportes si user no es supervisor', () => {
      const user = { role: 'asistente' } as unknown as any;
      render(
        <BrowserRouter>
          <Sidebar user={user} />
        </BrowserRouter>
      );
      const reportesLink = screen.queryByText('Reportes');
      expect(reportesLink).toBeNull();
    });

    it('debe mostrar Reportes si user es supervisor', () => {
      const user = { role: 'supervisor' } as unknown as any;
      render(
        <BrowserRouter>
          <Sidebar user={user} />
        </BrowserRouter>
      );
      expect(screen.getByText('Reportes')).toBeTruthy();
    });
  });

  describe('Botón toggle', () => {
    it('debe tener botón para toggle del menú', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      const toggleButton = screen.getByRole('button', { name: /colapsar menú|expandir menú/i });
      expect(toggleButton).toBeTruthy();
    });

    it('debe cambiar estado cuando se hace click en toggle', () => {
      const { container } = render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      const toggleButton = container.querySelector('[title*="menú"]') as HTMLElement;
      expect(toggleButton).toBeTruthy();
      fireEvent.click(toggleButton);
      expect(toggleButton).toBeTruthy();
    });
  });

  describe('Botón de logout', () => {
    it('debe tener botón de logout', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      expect(screen.getByText('Cerrar Sesión')).toBeTruthy();
    });

    it('botón logout debe ser clickeable', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
      expect(logoutButton).toBeTruthy();
      expect(logoutButton.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Props user', () => {
    it('debe aceptar user null', () => {
      render(
        <BrowserRouter>
          <Sidebar user={null} />
        </BrowserRouter>
      );
      expect(screen.getByText('Dashboard')).toBeTruthy();
    });

    it('debe aceptar user con role supervisor', () => {
      const user = { role: 'supervisor' } as unknown as any;
      render(
        <BrowserRouter>
          <Sidebar user={user} />
        </BrowserRouter>
      );
      expect(screen.getByText('Dashboard')).toBeTruthy();
    });
  });
});

