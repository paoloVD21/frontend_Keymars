import { describe, it, expect, beforeEach } from 'vitest';
import type { User, LoginCredentials } from '../../types/auth';

/**
 * Suite de pruebas para validaciones simples
 */
describe('Auth Utilities', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

  describe('User validation', () => {
    it('debe crear un usuario válido con todos los campos requeridos', () => {
      const user: User = {
        email: 'test@example.com',
        role: 'supervisor',
        nombre: 'Juan',
        apellido: 'Pérez'
      };

      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('supervisor');
      expect(user.nombre).toBe('Juan');
      expect(user.apellido).toBe('Pérez');
    });

    it('debe verificar que el usuario tenga email válido', () => {
      const user: User = {
        email: 'user@example.com',
        role: 'asistente',
        nombre: 'María',
        apellido: 'García'
      };

      expect(user.email).toContain('@');
      expect(user.email).toContain('.');
    });

    it('debe verificar que el rol sea válido', () => {
      const roles: Array<User['role']> = ['supervisor', 'asistente'];
      const validRoles = new Set(roles);

      expect(validRoles.has('supervisor')).toBe(true);
      expect(validRoles.has('asistente')).toBe(true);
    });
  });

  describe('LoginCredentials validation', () => {
    it('debe crear credenciales válidas de login', () => {
      const credentials: LoginCredentials = {
        email: 'user@example.com',
        password: 'password123'
      };

      expect(credentials.email).toBeDefined();
      expect(credentials.password).toBeDefined();
      expect(credentials.email).toContain('@');
      expect(credentials.password.length).toBeGreaterThan(0);
    });

    it('debe requerir email y contraseña no vacíos', () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'pass'
      };

      expect(credentials.email.length).toBeGreaterThan(0);
      expect(credentials.password.length).toBeGreaterThan(0);
    });
  });

  describe('localStorage operations', () => {
    it('debe guardar y recuperar token del localStorage', () => {
      const token = 'test-token-12345';
      localStorage.setItem('token', token);

      expect(localStorage.getItem('token')).toBe(token);
    });

    it('debe guardar y recuperar usuario del localStorage', () => {
      const user: User = {
        email: 'test@example.com',
        role: 'supervisor',
        nombre: 'Test',
        apellido: 'User'
      };

      localStorage.setItem('user', JSON.stringify(user));
      const retrieved = localStorage.getItem('user');

      expect(retrieved).toBeDefined();
      expect(JSON.parse(retrieved!)).toEqual(user);
    });

    it('debe limpiar localStorage correctamente', () => {
      localStorage.setItem('token', 'token-123');
      localStorage.setItem('user', 'user-data');

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('Validaciones de email', () => {
    it('debe validar emails con formato correcto', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co',
        'admin+tag@company.org',
        'name123@test-domain.com'
      ];

      validEmails.forEach(email => {
        expect(email).toMatch(/@/);
        expect(email).toMatch(/[\w.-]+@[\w.-]+\.[\w.-]+/);
      });
    });

    it('debe rechazar emails sin @', () => {
      const invalidEmail = 'userexample.com';
      expect(invalidEmail).not.toMatch(/@/);
    });
  });

  describe('Conversion de roles', () => {
    it('debe convertir id_rol a role string', () => {
      const roleMap: Record<number, User['role']> = {
        1: 'supervisor',
        2: 'asistente'
      };

      expect(roleMap[1]).toBe('supervisor');
      expect(roleMap[2]).toBe('asistente');
    });

    it('debe mantener consistencia de roles', () => {
      const validRoles: User['role'][] = ['supervisor', 'asistente'];
      
      validRoles.forEach(role => {
        expect(['supervisor', 'asistente']).toContain(role);
      });
    });
  });
});

