import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';

/**
 * Suite de pruebas para authStore (Zustand)
 * Tests del estado y estructura sin mocking
 */
describe('authStore (Zustand)', () => {
  
  beforeEach(() => {
    // Resetear el store a su estado inicial
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    localStorage.clear();
  });

  describe('Estado inicial', () => {
    it('debe tener valores iniciales correctos', () => {
      const store = useAuthStore.getState();
      
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('debe tener métodos login y logout disponibles', () => {
      const store = useAuthStore.getState();
      
      expect(typeof store.login).toBe('function');
      expect(typeof store.logout).toBe('function');
    });

    it('debe tener estructura correcta de tipos', () => {
      const store = useAuthStore.getState();
      
      expect(store).toHaveProperty('user');
      expect(store).toHaveProperty('token');
      expect(store).toHaveProperty('isAuthenticated');
      expect(store).toHaveProperty('isLoading');
      expect(store).toHaveProperty('error');
    });
  });

  describe('Gestión de estado', () => {
    it('debe actualizar el usuario cuando se asigna', () => {
      const userData = {
        email: 'test@example.com',
        role: 'supervisor' as const,
        nombre: 'Test',
        apellido: 'User'
      };

      useAuthStore.setState({ user: userData });
      const store = useAuthStore.getState();

      expect(store.user).toEqual(userData);
      expect(store.user?.email).toBe('test@example.com');
    });

    it('debe actualizar el token cuando se asigna', () => {
      const token = 'test-token-123';
      useAuthStore.setState({ token });
      const store = useAuthStore.getState();

      expect(store.token).toBe(token);
    });

    it('debe actualizar isAuthenticated cuando cambia', () => {
      useAuthStore.setState({ isAuthenticated: true });
      const store = useAuthStore.getState();

      expect(store.isAuthenticated).toBe(true);

      useAuthStore.setState({ isAuthenticated: false });
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('debe actualizar isLoading cuando cambia', () => {
      useAuthStore.setState({ isLoading: true });
      expect(useAuthStore.getState().isLoading).toBe(true);

      useAuthStore.setState({ isLoading: false });
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('debe actualizar error cuando cambia', () => {
      const errorMsg = 'Login failed';
      useAuthStore.setState({ error: errorMsg });
      expect(useAuthStore.getState().error).toBe(errorMsg);

      useAuthStore.setState({ error: null });
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('Métodos disponibles', () => {
    it('login debe ser una función', () => {
      const store = useAuthStore.getState();
      expect(typeof store.login).toBe('function');
    });

    it('logout debe ser una función', () => {
      const store = useAuthStore.getState();
      expect(typeof store.logout).toBe('function');
    });
  });

  describe('Limpieza de estado', () => {
    it('debe poder limpiar todos los datos', () => {
      // Establecer datos
      useAuthStore.setState({
        user: {
          email: 'test@example.com',
          role: 'asistente',
          nombre: 'Test',
          apellido: 'User'
        },
        token: 'test-token',
        isAuthenticated: true,
        error: 'some error'
      });

      // Limpiar
      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });

      const store = useAuthStore.getState();
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(store.error).toBeNull();
    });

    it('debe poder limpiar solo el usuario', () => {
      useAuthStore.setState({
        user: { email: 'test@example.com', role: 'supervisor', nombre: 'Test', apellido: 'User' },
        token: 'token',
        isAuthenticated: true
      });

      useAuthStore.setState({ user: null });

      const store = useAuthStore.getState();
      expect(store.user).toBeNull();
      expect(store.token).toBe('token');
      expect(store.isAuthenticated).toBe(true);
    });
  });

  describe('localStorage integration', () => {
    it('debe poder guardar token en localStorage', () => {
      const token = 'storage-test-token';
      localStorage.setItem('token', token);

      expect(localStorage.getItem('token')).toBe(token);
    });

    it('debe poder guardar user en localStorage', () => {
      const user = {
        email: 'test@example.com',
        role: 'supervisor' as const,
        nombre: 'Test',
        apellido: 'User'
      };

      localStorage.setItem('user', JSON.stringify(user));
      const retrieved = localStorage.getItem('user');

      expect(retrieved).not.toBeNull();
      expect(JSON.parse(retrieved!)).toEqual(user);
    });

    it('debe poder limpiar localStorage', () => {
      localStorage.setItem('token', 'token');
      localStorage.setItem('user', 'user');

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});
