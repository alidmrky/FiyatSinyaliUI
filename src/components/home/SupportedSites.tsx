import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingDown, Bell } from 'lucide-react';

interface SiteCard {
    name: string;
    domain: string;
    url: string;
    color: string;
    gradient: string;
}

export const SupportedSites = () => {
    const sites: SiteCard[] = [
        {
            name: 'Boyner',
            domain: 'boyner.com.tr',
            url: 'https://www.boyner.com.tr',
            color: 'text-blue-600',
            gradient: 'from-blue-600/20 to-blue-800/20',
        },
        {
            name: 'Beymen',
            domain: 'beymen.com',
            url: 'https://www.beymen.com/tr',
            color: 'text-purple-600',
            gradient: 'from-purple-600/20 to-purple-800/20',
        },
        {
            name: 'Vakko',
            domain: 'vakko.com',
            url: 'https://www.vakko.com',
            color: 'text-amber-600',
            gradient: 'from-amber-600/20 to-amber-800/20',
        },
        {
            name: 'Zara',
            domain: 'zara.com',
            url: 'https://www.zara.com/tr/',
            color: 'text-slate-800',
            gradient: 'from-slate-600/20 to-slate-800/20',
        },
    ];

    const features = [
        {
            icon: BarChart3,
            title: 'Fiyat Takibi',
            description: 'Ürün fiyatlarını gerçek zamanlı olarak takip edin',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        },
        {
            icon: Bell,
            title: 'Fiyat Alarmları',
            description: 'İstediğiniz fiyata düştüğünde bildirim alın',
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
        {
            icon: TrendingDown,
            title: 'Fiyat Geçmişi',
            description: 'Ürünlerin fiyat geçmişini görüntüleyin',
            color: 'text-amber-600',
            bgColor: 'bg-amber-100 dark:bg-amber-900/20',
        },
    ];

    return (
        <div className="space-y-12">
            {/* Supported Sites */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <h2 className="text-3xl font-bold text-center mb-8">
                    Desteklenen E-Ticaret Siteleri
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {sites.map((site, index) => {
                        return (
                            <motion.div
                                key={site.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                            >
                                <a
                                    href={site.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Card className="hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-600/30 hover:scale-105 duration-300">
                                        <CardContent className="p-8 text-center">
                                            {/* Logo Container */}
                                            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 mb-4 p-4 shadow-md`}>
                                                <img
                                                    src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=128`}
                                                    alt={`${site.name} Logo`}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        // Fallback to site name initial
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const parent = target.parentElement!;
                                                        parent.className = `inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${site.gradient} mb-4`;
                                                        parent.innerHTML = `<span class="text-4xl font-bold ${site.color}">${site.name[0]}</span>`;
                                                    }}
                                                />
                                            </div>
                                            <h3 className="text-2xl font-semibold mb-2">{site.name}</h3>
                                            <p className="text-sm text-muted-foreground">Aktif olarak takip ediliyor</p>
                                            <div className="mt-3 inline-flex items-center text-xs text-purple-600 dark:text-purple-400">
                                                <span>Siteyi ziyaret et →</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </a>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Features */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
            >
                <h2 className="text-3xl font-bold text-center mb-8">
                    Özellikler
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 + index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mb-4`}>
                                            <Icon className={`h-6 w-6 ${feature.color}`} />
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};
