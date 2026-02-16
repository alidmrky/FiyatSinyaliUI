import { Outlet, Link, useLocation } from 'react-router-dom'
import { APP_NAME } from '@/constants'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    Users,
    Tag,
    Activity,
    LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Ürünler', href: '/admin/products', icon: Package },
    { name: 'Siparişler', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Kategoriler', href: '/admin/categories', icon: Tag },
    { name: 'Scraper İzleme', href: '/admin/scraper-monitoring', icon: Activity },
    { name: 'Kullanıcılar', href: '/admin/users', icon: Users },
    { name: 'Raporlar', href: '/admin/reports', icon: BarChart3 },
    { name: 'Site Konfigürasyonu', href: '/admin/site-config', icon: Settings },
]

const AdminLayout = () => {
    const location = useLocation()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-slate-900">
                {/* Logo */}
                <div className="flex items-center h-16 px-6 bg-slate-800">
                    <h1 className="text-xl font-bold text-white">{APP_NAME}</h1>
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-3">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                        isActive
                                            ? 'bg-slate-800 text-white'
                                            : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                        <LogOut className="mr-3 h-5 w-5" />
                        Çıkış Yap
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="pl-64">
                {/* Top Bar */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Admin Panel</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Ana Siteye Dön
                            </Link>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
