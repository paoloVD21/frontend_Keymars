import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const DashboardLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white">
                <nav className="mt-5">
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-700">
                        Dashboard
                    </Link>
                    <Link to="/products" className="block px-4 py-2 hover:bg-gray-700">
                        Productos
                    </Link>
                    <Link to="/inventory" className="block px-4 py-2 hover:bg-gray-700">
                        Inventario
                    </Link>
                    <Link to="/suppliers" className="block px-4 py-2 hover:bg-gray-700">
                        Proveedores
                    </Link>
                    <Link to="/alerts" className="block px-4 py-2 hover:bg-gray-700">
                        Alertas
                    </Link>
                    
                    {/* Menú solo para supervisores */}
                    {user?.role === 'Supervisor' && (
                        <>
                            <Link to="/users" className="block px-4 py-2 hover:bg-gray-700">
                                Usuarios
                            </Link>
                            <Link to="/reports" className="block px-4 py-2 hover:bg-gray-700">
                                Reportes
                            </Link>
                        </>
                    )}
                </nav>
            </aside>

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