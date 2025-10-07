import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface PrivateRouteProps {
    allowedRoles?: ('supervisor' | 'asistente')[];
}

export const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Verificar rol si se especifican roles permitidos
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};