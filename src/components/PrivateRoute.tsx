import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import type { UserRole } from '../types/auth';

interface PrivateRouteProps {
    allowedRoles?: UserRole[];
}

export const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuthStore();

    // Mientras se está cargando, mostrar nada o un spinner
    if (isLoading) {
        return <div>Cargando...</div>;
    }

    // Solo redirigir al login si no está autenticado y ya terminó de cargar
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Verificar rol si se especifican roles permitidos
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
};