/**
 * Roles de usuario en el sistema
 * Mapeo desde id_rol del backend:
 * - 1 -> 'supervisor'
 * - 0 -> 'asistente'
 */
export type UserRole = 'supervisor' | 'asistente';

export interface User {
    email: string;
    role: UserRole;
    nombre: string;
    apellido: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}