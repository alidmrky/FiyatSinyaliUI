import { RouteConfig } from './routes.config.types'
import HomePage from '@/pages/HomePage'
import AdminPage from '@/pages/AdminPage'
import CategoriesPage from '@/pages/admin/CategoriesPage'
import ScraperMonitoringPage from '@/pages/admin/ScraperMonitoring'
import SiteConfigPage from '@/pages/admin/SiteConfigPage'
import BrandsPage from '@/pages/admin/BrandsPage'
import ColorsPage from '@/pages/admin/ColorsPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ProfilePage from '@/pages/auth/ProfilePage'
import ScrapTestPage from '@/pages/admin/ScrapTestPage'


export const APP_ROUTES: RouteConfig[] = [
    {
        path: '/',
        element: <HomePage />,
        menu: {
            label: 'Ana Sayfa',
            order: 1,
        },
    },
    // Auth routes (no menu)
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/profile',
        element: <ProfilePage />,
    },
    // Admin routes
    {
        path: '/admin',
        element: <AdminPage />,
        menu: {
            label: 'Admin Panel',
            order: 2,
        },
    },
    {
        path: '/admin/categories',
        element: <CategoriesPage />,
        menu: {
            label: 'Kategoriler',
            order: 3,
        },
    },
    {
        path: '/admin/brands',
        element: <BrandsPage />,
        menu: {
            label: 'Markalar',
            order: 4,
        },
    },
    {
        path: '/admin/colors',
        element: <ColorsPage />,
        menu: {
            label: 'Renkler',
            order: 5,
        },
    },
    {
        path: '/admin/scraper-monitoring',
        element: <ScraperMonitoringPage />,
        menu: {
            label: 'Scraper İzleme',
            order: 6,
        },
    },
    {
        path: '/admin/site-config',
        element: <SiteConfigPage />,
        menu: {
            label: 'Site Konfigürasyonu',
            order: 7,
        },
    },
    {
        path: '/admin/scrap-test',
        element: <ScrapTestPage />,
        menu: {
            label: 'Scraper Test',
            order: 8,
        },
    },
]

