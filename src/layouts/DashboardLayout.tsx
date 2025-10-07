import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sidebar } from '../components/ui/Sidebar';

export const DashboardLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex">
            <Sidebar user={user} />

            {/* Contenido principal */}
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <span className="text-gray-600">
                            Bienvenido, {user?.email}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Cerrar Sesión
                    </button>
                </header>
                
                <Outlet />
            </main>
        </div>
    );
};