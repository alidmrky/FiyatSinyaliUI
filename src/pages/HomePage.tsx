import { ParticlesNetwork } from '@/components/home/ParticlesNetwork';
import { SupportedSites } from '@/components/home/SupportedSites';
import { FeaturesCTA } from '@/components/home/FeaturesCTA';
import { motion } from 'framer-motion';
import { TrendingDown, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen relative">
            {/* Hero Section with Particles Network */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-purple-50/30 to-background dark:from-background dark:via-purple-950/20 dark:to-background">
                {/* Particles Network Background */}
                <ParticlesNetwork />

                {/* Hero Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-2xl mb-6"
                        >
                            <TrendingDown className="h-12 w-12 text-white" />
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight">
                            <span className="bg-gradient-to-r from-purple-600 via-purple-800 to-green-600 bg-clip-text text-transparent">
                                FİYATSİNYALİ
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Türkiye'nin önde gelen e-ticaret sitelerinden ürün fiyatlarını takip edin,
                            <br className="hidden md:block" />
                            en iyi fırsatları kaçırmayın!
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                            <Link to="/login">
                                <Button
                                    size="lg"
                                    className="gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-lg px-8 py-6 shadow-lg min-w-[250px]"
                                >
                                    <Search className="h-5 w-5" />
                                    Hemen Kullanmaya Başla
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap justify-center gap-8 pt-12 text-sm text-muted-foreground"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>4+ E-Ticaret Sitesi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>Gerçek Zamanlı Takip</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>Ücretsiz Kullanım</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-muted-foreground text-sm flex flex-col items-center gap-2"
                    >
                        <span>Aşağı Kaydır</span>
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </motion.div>
                </motion.div>
            </section>

            {/* Content Sections */}
            <div className="relative z-10 bg-background">
                <div className="max-w-7xl mx-auto p-6 space-y-24 py-24">
                    {/* Supported Sites */}
                    <SupportedSites />

                    {/* Features CTA */}
                    <FeaturesCTA />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
