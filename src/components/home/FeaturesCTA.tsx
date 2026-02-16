import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Search,
    Bell,
    BarChart3,
    ArrowRight,
    Rocket,
    CheckCircle2,
    Tag
} from 'lucide-react';

interface Step {
    number: number;
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
}

export const FeaturesCTA = () => {
    const steps: Step[] = [
        {
            number: 1,
            icon: Search,
            title: 'Ürün Ara',
            description: 'Takip etmek istediğiniz ürünleri arayın',
            gradient: 'from-purple-600/90 to-purple-800/90',
        },
        {
            number: 2,
            icon: Tag,
            title: 'Fiyat Takibi',
            description: 'Ürün fiyatlarını gerçek zamanlı izleyin',
            gradient: 'from-green-600/90 to-green-800/90',
        },
        {
            number: 3,
            icon: Bell,
            title: 'Bildirim Al',
            description: 'İstediğiniz fiyata düştüğünde haber alın',
            gradient: 'from-amber-600/90 to-amber-800/90',
        },
        {
            number: 4,
            icon: BarChart3,
            title: 'Fiyat Geçmişi',
            description: 'Fiyat trendlerini analiz edin',
            gradient: 'from-blue-600/90 to-blue-800/90',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
        >
            <Card className="overflow-hidden border-2 border-purple-600/30 bg-card">
                <CardContent className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-green-600 mb-4 shadow-lg"
                        >
                            <Rocket className="h-8 w-8 text-white" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">
                            Nasıl Çalışır?
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            FiyatSinyali ile e-ticaret sitelerinden ürün fiyatlarını takip etmek çok kolay!
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="relative"
                                >
                                    {/* Connection Line */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-purple-600/30 to-transparent z-0" />
                                    )}

                                    <div className="relative z-10 flex flex-col items-center text-center p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-purple-600/20 hover:border-purple-600/50 transition-colors">
                                        {/* Step Number & Icon */}
                                        <div className="relative mb-4">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                                                <Icon className="h-7 w-7 text-white" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-purple-600 flex items-center justify-center">
                                                <span className="text-xs font-bold text-purple-600">{step.number}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Birden fazla site desteği</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Gerçek zamanlı fiyat güncellemeleri</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Detaylı fiyat geçmişi ve analizler</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                        <Button
                            size="lg"
                            className="gap-2 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-lg px-8 py-6 shadow-lg"
                        >
                            <Search className="h-5 w-5" />
                            Ürün Aramaya Başla
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-3">
                            Ücretsiz başlayın, hiçbir ödeme bilgisi gerekmez
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
