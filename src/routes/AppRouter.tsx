import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Páginas públicas
import { LoginPage } from '../pages/auth/LoginPage';

import { UsersPage } from '../pages/users/UsersPage';
import { ProveedoresPage } from '../pages/proveedores/ProveedoresPage';
import { ProductosPage } from '../pages/productos/ProductosPage';
import { EntradaPage } from '../pages/entradas/EntradaPage';
import { SalidaPage } from '../pages/salidas/SalidaPage';
import { ReportesPage } from '../pages/reportes/ReportesPage';


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
                    element: <Navigate to="/productos" replace />
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
                            index: true,
                            element: <ProductosPage />
                        },
                        {
                            path: 'productos',
                            element: <ProductosPage />
                        },
                        {
                            path: 'suppliers',
                            element: <ProveedoresPage />
                        },
                        {
                            path: 'entradas',
                            element: <EntradaPage />
                        },
                        {
                            path: 'salidas',
                            element: <SalidaPage />
                        }
                    ]
                },
                {
                    // Rutas solo para supervisores
                    element: <PrivateRoute allowedRoles={['supervisor']} />,
                    children: [
                        {
                            path: 'users',
                            element: <UsersPage />
                        },
                        {
                            path: 'reportes',
                            element: <ReportesPage />
                        }
                    ]
                },
                {
                    path: '*',
                    element: <div>En construcción</div>
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