import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';

export const PersonalizedWelcome = () => {
    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-6 py-12"
            >
                {/* Icon & Greeting */}
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <div className="relative">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg">
                                <TrendingDown className="h-10 w-10 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-800 to-green-600 bg-clip-text text-transparent">
                            FiyatSinyali'ne Hoş Geldiniz! 👋
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Türkiye'nin önde gelen e-ticaret sitelerinden ürün fiyatlarını takip edin,
                            en iyi fırsatları kaçırmayın!
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};
