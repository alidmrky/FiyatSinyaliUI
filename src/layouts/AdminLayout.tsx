import { Outlet, Link, useLocation } from 'react-router-dom'
import { APP_NAME } from '@/constants'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    Users,
    Tag,
    Activity,
    LogOut,
    Award,
    Palette,
    TrendingDown,
    Home,
    FlaskConical
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Ürünler', href: '/admin/products', icon: Package },
    { name: 'Siparişler', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Kategoriler', href: '/admin/categories', icon: Tag },
    { name: 'Markalar', href: '/admin/brands', icon: Award },
    { name: 'Renkler', href: '/admin/colors', icon: Palette },
    { name: 'Scraper İzleme', href: '/admin/scraper-monitoring', icon: Activity },
    { name: 'Scraper Test', href: '/admin/scrap-test', icon: FlaskConical },
    { name: 'Kullanıcılar', href: '/admin/users', icon: Users },
    { name: 'Raporlar', href: '/admin/reports', icon: BarChart3 },
    { name: 'Site Konfigürasyonu', href: '/admin/site-config', icon: Settings },
]

const AdminLayout = () => {
    const location = useLocation()
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            {/* Sidebar */}
            <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="fixed inset-y-0 left-0 w-72 z-50"
            >
                {/* Glassmorphic Sidebar Container */}
                <div className="h-full m-4 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-purple-100/50">
                        <Link to="/" className="flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center shadow-lg"
                            >
                                <TrendingDown className="h-7 w-7 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    {APP_NAME}
                                </h1>
                                <p className="text-xs text-muted-foreground">Admin Panel</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 flex-1 overflow-y-auto">
                        <div className="space-y-1">
                            {navigation.map((item, index) => {
                                const isActive = location.pathname === item.href
                                return (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                                                isActive
                                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                            )}
                                        >
                                            {/* Hover Effect Background */}
                                            {!isActive && (
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-purple-100 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    layoutId="hoverBackground"
                                                />
                                            )}

                                            <item.icon className={cn(
                                                "h-5 w-5 relative z-10 transition-transform group-hover:scale-110",
                                                isActive ? "text-white" : "text-purple-600"
                                            )} />
                                            <span className="relative z-10">{item.name}</span>

                                            {/* Active Indicator */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-purple-100/50">
                        {/* User Info */}
                        <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-semibold shadow-lg">
                                    {user?.firstName?.[0] || 'A'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user?.firstName || 'Admin'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user?.email || 'admin@example.com'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Link
                                to="/"
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all group"
                            >
                                <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span>Ana Siteye Dön</span>
                            </Link>

                            <button
                                onClick={logout}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all group"
                            >
                                <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span>Çıkış Yap</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="pl-80">
                {/* Modern Top Bar */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="sticky top-4 z-40 mx-4 mb-6"
                >
                    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    {navigation.find(item => item.href === location.pathname)?.name || 'Admin Panel'}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Hoş geldiniz, {user?.firstName || 'Admin'}
                                </p>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-green-700">Sistem Aktif</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Page Content */}
                <main className="px-4 pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>

            {/* Add Custom Animations */}
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}

export default AdminLayout
