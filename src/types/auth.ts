export interface User {
    email: string;
    role: 'Supervisor' | 'Asistente';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}