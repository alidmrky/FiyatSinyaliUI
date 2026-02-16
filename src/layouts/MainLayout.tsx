import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { APP_NAME } from '@/constants';
import { motion } from 'framer-motion';
import { TrendingDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MainLayout = () => {
    const { user, isAuthenticated, logout } = useAuth();

    // Debug: Log auth state changes
    React.useEffect(() => {
        console.log('🔍 [MainLayout] Auth state değişti:', {
            isAuthenticated,
            user: user ? {
                firstName: user.firstName,
                email: user.email,
                roles: user.roles
            } : null
        });
    }, [user, isAuthenticated]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Modern Glassmorphism Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <TrendingDown className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    {APP_NAME}
                                </h1>
                                <p className="text-xs text-muted-foreground">Fiyat Takip Platformu</p>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="flex items-center gap-4">
                            {!isAuthenticated ? (
                                /* Show Login Button when not authenticated */
                                <Link to="/login">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            className="gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg"
                                        >
                                            Giriş Yap
                                        </Button>
                                    </motion.div>
                                </Link>
                            ) : (
                                /* Show User Dropdown when authenticated */
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600/10 transition-colors"
                                        >
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-semibold shadow-lg">
                                                {user?.firstName?.[0] || user?.email?.[0].toUpperCase()}
                                            </div>
                                            {/* User Name */}
                                            <div className="text-left hidden md:block">
                                                <p className="text-sm font-semibold">
                                                    {user?.firstName || user?.email?.split('@')[0]}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </motion.button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem asChild>
                                            <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                                                <User className="h-4 w-4" />
                                                <span>Profil</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        {/* Show Admin Panel only for admins */}
                                        {user?.roles?.includes('Admin') && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                                                        <Settings className="h-4 w-4" />
                                                        <span>Admin Panel</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={logout}
                                            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Çıkış Yap</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </nav>
                    </div>
                </div>
            </motion.header>

            {/* Main Content with top padding */}
            <main className="flex-1 pt-20">
                <Outlet />
            </main>

            {/* Modern Footer */}
            <footer className="bg-gradient-to-b from-background to-slate-50 dark:to-slate-950 border-t border-border/40">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* About */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                                    <TrendingDown className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-bold text-lg">{APP_NAME}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Türkiye'nin en iyi fiyat takip platformu.
                                E-ticaret sitelerinden ürün fiyatlarını takip edin.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Link to="/" className="hover:text-purple-600 transition-colors">Ana Sayfa</Link>
                                </li>
                                {user?.roles?.includes('Admin') && (
                                    <li>
                                        <Link to="/admin" className="hover:text-purple-600 transition-colors">Admin Panel</Link>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold mb-4">İletişim</h4>
                            <p className="text-sm text-muted-foreground">
                                E-ticaret fiyat takibi için en doğru adres.
                            </p>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
                        <p>© 2026 {APP_NAME}. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
