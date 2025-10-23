
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, Database, Filter, Sparkles } from 'lucide-react';

interface SearchingViewProps {
    loadingText: string;
}

const SearchingView: React.FC<SearchingViewProps> = ({ loadingText }) => {
    const icons = [Search, Database, Filter, Sparkles];
    
    return (
        <motion.div
            key="searching"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-[80vh] flex flex-col items-center justify-center relative overflow-hidden"
        >
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-indigo-200/20 to-purple-200/20"
                        style={{
                            width: 300 + i * 200,
                            height: 300 + i * 200,
                            left: '50%',
                            top: '50%',
                            translateX: '-50%',
                            translateY: '-50%'
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5
                        }}
                    />
                ))}
            </div>

            {/* Floating icons */}
            <div className="relative mb-12">
                {icons.map((Icon, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: Math.cos((i / icons.length) * Math.PI * 2) * 80,
                            top: Math.sin((i / icons.length) * Math.PI * 2) * 80
                        }}
                        animate={{
                            y: [-10, 10, -10],
                            rotate: [0, 360]
                        }}
                        transition={{
                            y: { duration: 2, repeat: Infinity, delay: i * 0.2 },
                            rotate: { duration: 8, repeat: Infinity, ease: 'linear' }
                        }}
                    >
                        <div className="bg-white p-3 rounded-xl shadow-lg">
                            <Icon className="w-6 h-6 text-indigo-600" />
                        </div>
                    </motion.div>
                ))}
                
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                    <Loader2 className="w-20 h-20 text-indigo-600" />
                </motion.div>
            </div>

            <motion.h2 
                className="text-3xl font-bold text-stone-800 mb-4 relative z-10"
                key={loadingText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {loadingText}
            </motion.h2>
            
            <div className="w-80 h-2 bg-stone-200 rounded-full overflow-hidden relative z-10">
                <motion.div
                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
                    initial={{ width: "0%", backgroundPosition: "0% 50%" }} 
                    animate={{ 
                        width: "100%",
                        backgroundPosition: "200% 50%"
                    }} 
                    transition={{ 
                        width: { duration: 3.5, ease: "easeInOut" },
                        backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                    }}
                    style={{ backgroundSize: "200% 100%" }}
                />
            </div>

            <motion.p
                className="text-sm text-stone-500 mt-6 relative z-10"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Searching exclusive databases...
            </motion.p>
        </motion.div>
    );
};

export default SearchingView;
