import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Páginas públicas
import { LoginPage } from '../pages/auth/LoginPage';

// Páginas privadas - TODO: Implementar estos componentes
// import { DashboardPage } from '../pages/dashboard/DashboardPage';
// import { ProductsPage } from '../pages/products/ProductsPage';
// import { InventoryPage } from '../pages/inventory/InventoryPage';
// import { SuppliersPage } from '../pages/suppliers/SuppliersPage';
import { UsersPage } from '../pages/users/UsersPage';
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
                        // TODO: Implementar estas páginas
                        /*{
                            path: 'dashboard',
                            element: <DashboardPage />
                        },
                        {
                            path: 'products',
                            element: <ProductsPage />
                        },
                        {
                            path: 'inventory',
                            element: <InventoryPage />
                        },
                        {
                            path: 'suppliers',
                            element: <SuppliersPage />
                        },
                        {
                            path: 'alerts',
                            element: <AlertsPage />
                        }*/
                        // Por ahora, solo redirigimos a una página temporal
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