import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sidebar } from '../components/ui/Sidebar';

export const DashboardLayout = () => {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen flex">
            <Sidebar user={user} />

            {/* Contenido principal */}
            <main className="flex-1 p-8">
                <header className="mb-8">
                    <div>
                        <span className="text-gray-600">
                            Bienvenido, {user?.email}
                        </span>
                    </div>
                </header>
                
                <Outlet />
            </main>
        </div>
    );
};