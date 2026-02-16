import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import { APP_ROUTES } from './config/routes.config'

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: APP_ROUTES.filter(route => !route.path.startsWith('/admin')),
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: APP_ROUTES.filter(route => route.path.startsWith('/admin')).map(route => ({
            ...route,
            path: route.path === '/admin' ? '' : route.path.replace('/admin/', ''),
        })),
    },
])

const AppRoutes = () => {
    return <RouterProvider router={router} />
}

export default AppRoutes
