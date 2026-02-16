import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
    return (
        <>
            {/* Gradient Blobs - Purple/Green theme for price tracking */}
            <motion.div
                className="absolute top-10 left-0 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/30 rounded-full filter blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 80, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute top-40 right-0 w-[500px] h-[500px] bg-green-500/20 dark:bg-green-600/30 rounded-full filter blur-3xl"
                animate={{
                    x: [0, -60, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-amber-500/15 dark:bg-amber-600/25 rounded-full filter blur-3xl"
                animate={{
                    x: [0, 70, 0],
                    y: [0, -60, 0],
                    scale: [1, 1.25, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />

            {/* Floating Particles - representing price data points */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-purple-400/40 dark:bg-purple-500/50 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/70" />
        </>
    );
};
