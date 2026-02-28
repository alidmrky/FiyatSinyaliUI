import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
    Package,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Database,
    Server,
    Store,
    RefreshCw,
    Palette,
} from 'lucide-react';
import { dashboardService } from '@/services/api/dashboard';
import type { DashboardStats } from '@/types/dashboard';
import { useLoading } from '@/contexts/LoadingContext';
import { useNotification } from '@/contexts/NotificationContext';

const AdminPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { showLoading, hideLoading } = useLoading();
    const { error: showError } = useNotification();

    const loadStats = async (silent = false) => {
        if (!silent) {
            showLoading('Dashboard yükleniyor...');
        }
        setIsRefreshing(true);

        try {
            const data = await dashboardService.getStats();
            setStats(data);
        } catch (err: any) {
            console.error('Dashboard stats error:', err);
            showError(err.message || 'Dashboard yüklenirken hata oluştu');
        } finally {
            if (!silent) {
                hideLoading();
            }
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadStats();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            loadStats(true);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (!stats) {
        return null; // Loading handled by LoadingContext
    }

    const mongoStats = [
        {
            title: 'Beklemede',
            value: stats.mongoProductStats.pendingCount.toLocaleString(),
            icon: Clock,
            gradient: 'from-yellow-500 to-amber-500',
            bgGradient: 'from-yellow-50 to-amber-50',
            description: 'İşleme alınacak',
        },
        {
            title: 'Kuyrukta',
            value: stats.mongoProductStats.publishedCount.toLocaleString(),
            icon: CheckCircle,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50',
            description: 'Yayında',
        },
        {
            title: 'Başarısız',
            value: stats.mongoProductStats.failedCount.toLocaleString(),
            icon: XCircle,
            gradient: 'from-red-500 to-rose-500',
            bgGradient: 'from-red-50 to-rose-50',
            description: 'Hata aldı',
        },
        {
            title: 'Marka Problemi',
            value: stats.mongoProductStats.brandUnresolvedCount.toLocaleString(),
            icon: AlertCircle,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-50 to-red-50',
            description: 'Marka eşleşmedi',
        },
        {
            title: 'Renk Problemi',
            value: stats.mongoProductStats.colorUnresolvedCount.toLocaleString(),
            icon: Palette,
            gradient: 'from-pink-500 to-fuchsia-500',
            bgGradient: 'from-pink-50 to-fuchsia-50',
            description: 'Renk eşleşmedi',
        },
    ];

    const dbStats = [
        {
            title: 'MongoDB Toplam',
            value: stats.mongoProductStats.totalCount.toLocaleString(),
            icon: Database,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50',
            description: 'Toplam kayıt',
        },
        {
            title: 'PostgreSQL Toplam',
            value: stats.postgreProductStats.totalCount.toLocaleString(),
            icon: Server,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50',
            description: 'Aktif ürün',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">Sistem istatistikleri ve durum bilgileri</p>
                </div>
                <button
                    onClick={() => loadStats()}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Yenile
                </button>
            </div>

            {/* MongoDB Product Status Stats */}
            <div>
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    MongoDB - Ürün Durumları
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {mongoStats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="relative overflow-hidden border-white/20 bg-white/80 backdrop-blur-xl hover:shadow-xl transition-all duration-300 group">
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                />

                                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <stat.icon className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Database Stats */}
            <div>
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Veritabanı İstatistikleri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dbStats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <Card className="relative overflow-hidden border-white/20 bg-white/80 backdrop-blur-xl hover:shadow-xl transition-all duration-300 group">
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                />

                                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <stat.icon className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Site Product Counts Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card className="border-white/20 bg-white/80 backdrop-blur-xl shadow-xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    Site Bazlı Ürün Sayıları
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    PostgreSQL - Aktif site istatistikleri
                                </CardDescription>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium">
                                {stats.postgreProductStats.siteProductCounts.length} Site
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl overflow-hidden border border-purple-100/50">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-50 hover:to-pink-50">
                                        <TableHead className="font-semibold">Site Adı</TableHead>
                                        <TableHead className="font-semibold text-right">Ürün Sayısı</TableHead>
                                        <TableHead className="font-semibold text-right">Yüzde</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.postgreProductStats.siteProductCounts.map((site, index) => {
                                        const percentage = (
                                            (site.productCount / stats.postgreProductStats.totalCount) *
                                            100
                                        ).toFixed(1);

                                        return (
                                            <motion.tr
                                                key={site.siteName}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 + index * 0.05 }}
                                                className="border-b border-purple-50 hover:bg-purple-50/50 transition-colors"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Store className="h-4 w-4 text-purple-600" />
                                                        {site.siteName}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-purple-700">
                                                    {site.productCount.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="secondary" className="shadow-sm">
                                                        %{percentage}
                                                    </Badge>
                                                </TableCell>
                                            </motion.tr>
                                        );
                                    })}
                                    {stats.postgreProductStats.siteProductCounts.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                                Henüz site verisi bulunmuyor
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Completed Count */}
            {stats.mongoProductStats.completedCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
                                    <Package className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tamamlanan İşlemler</p>
                                    <p className="text-2xl font-bold text-green-700">
                                        {stats.mongoProductStats.completedCount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default AdminPage;
