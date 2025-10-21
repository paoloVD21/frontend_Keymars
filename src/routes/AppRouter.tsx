import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Páginas públicas
import { LoginPage } from '../pages/auth/LoginPage';

// Páginas privadas - TODO: Implementar estos componentes
// import { DashboardPage } from '../pages/dashboard/DashboardPage';
// import { ProductsPage } from '../pages/products/ProductsPage';
// import { SuppliersPage } from '../pages/suppliers/SuppliersPage';
import { UsersPage } from '../pages/users/UsersPage';
import { ProveedoresPage } from '../pages/proveedores/ProveedoresPage';
import { ProductosPage } from '../pages/productos/ProductosPage';
// import { ReportsPage } from '../pages/reports/ReportsPage';
// import { AlertsPage } from '../pages/alerts/AlertsPage';

export const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <AuthLayout />,
            children: [
                {
                    path: 'login',
                    element: <LoginPage />
                },
                {
                    path: '/',
                    element: <Navigate to="/dashboard" replace />
                }
            ]
        },
        {
            path: '/',
            element: <DashboardLayout />,
            children: [
                {
                    element: <PrivateRoute />,
                    children: [
                        {
                            path: 'suppliers',
                            element: <ProveedoresPage />
                        },
                        {
                            path: 'productos',
                            element: <ProductosPage />
                        },
                        {
                            path: '*',
                            element: <div>En construcción</div>
                        }
                    ]
                },
                {
                    // Rutas solo para supervisores - TODO: Implementar
                    element: <PrivateRoute allowedRoles={['supervisor']} />,
                    children: [
                        {
                            path: 'users',
                            element: <UsersPage />
                        },
                        // TODO: Implementar estas páginas
                        /*{
                            path: 'reports',
                            element: <ReportsPage />
                        }*/
                        {
                            path: '*',
                            element: <div>En construcción</div>
                        }
                    ]
                }
            ]
        },
        {
            path: '*',
            element: <Navigate to="/login" replace />
        }
    ]);

    return <RouterProvider router={router} />;
};