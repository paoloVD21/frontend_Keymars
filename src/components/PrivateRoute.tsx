import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import type { UserRole } from '../types/auth';

interface PrivateRouteProps {
    allowedRoles?: UserRole[];
}

export const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuthStore();

    console.log('PrivateRoute Estado:', {
        isAuthenticated,
        isLoading,
        hasUser: !!user,
        userRole: user?.role
    });

    // Mientras se está cargando, mostrar nada o un spinner
    if (isLoading) {
        console.log('Cargando autenticación...');
        return <div>Cargando...</div>;
    }

    // Solo redirigir al login si no está autenticado y ya terminó de cargar
    if (!isAuthenticated) {
        console.log('Usuario no autenticado, redirigiendo a login');
        return <Navigate to="/login" replace />;
    }

    // Verificar rol si se especifican roles permitidos
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        console.log('Usuario no tiene permisos necesarios');
        return <Navigate to="/unauthorized" replace />;
    }

    console.log('Acceso permitido');
    return <Outlet />;
};