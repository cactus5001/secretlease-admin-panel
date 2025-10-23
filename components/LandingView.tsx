
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingDown, Shield, Zap, Star, ChevronRight } from 'lucide-react';
import { type City } from '../types';
import { cn } from '../lib/utils';

interface LandingViewProps {
    handleSearch: (e: React.FormEvent) => void;
    selectedCity: City;
    setSelectedCity: (city: City) => void;
    maxBudget: number;
    setMaxBudget: (budget: number) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ handleSearch, selectedCity, setSelectedCity, maxBudget, setMaxBudget }) => {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const stats = [
        { label: 'Active Listings', value: '800+', icon: TrendingDown },
        { label: 'Avg. Savings', value: '35%', icon: Zap },
        { label: 'Cities Covered', value: '2', icon: Shield },
        { label: 'Happy Renters', value: '500+', icon: Star }
    ];

    const testimonials = [
        { name: 'Sarah M.', text: 'Found a 2BR in Williamsburg for $1,800. Saved $600/month!', rating: 5 },
        { name: 'James K.', text: 'This platform is a game-changer. No broker fees, no hassle.', rating: 5 },
        { name: 'Emily R.', text: 'Got my dream apartment in Silver Lake for 40% below market.', rating: 5 }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    return (
        <motion.div
            key="landing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-20 flex flex-col items-center text-center"
        >
            <motion.div 
                initial={{ y: 40, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl space-y-6"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-4"
                >
                    ✨ Exclusive Off-Market Access
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-stone-900 leading-none">
                    Unlock <span className="gradient-text">Off-Market</span> Rentals in NY & LA
                </h1>
                <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                    Access over 800+ unlisted apartments. Deals 30-40% below market rate.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 hover-lift transition-smooth"
                        >
                            <stat.icon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                            <div className="text-3xl font-black text-stone-900">{stat.value}</div>
                            <div className="text-xs text-stone-500 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.form
                initial={{ y: 60, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.4, duration: 0.6 }}
                onSubmit={handleSearch}
                className="mt-16 w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl shadow-stone-200/40 border border-stone-100 space-y-6"
            >
                <div className="grid grid-cols-2 gap-3">
                    {(['NY', 'LA'] as const).map(c => (
                        <button
                            key={c} type="button" onClick={() => setSelectedCity(c)}
                            className={cn("py-4 rounded-xl font-bold border-2 transition-all hover-scale",
                                selectedCity === c ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-stone-100 text-stone-500 hover:border-stone-300")}
                        >
                            {c === 'NY' ? '🗽 New York' : '🌴 Los Angeles'}
                        </button>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                        <span>Max Budget</span>
                        <span className="text-indigo-600">${maxBudget}</span>
                    </div>
                    <input type="range" min="500" max="5000" step="100" value={maxBudget} onChange={e => setMaxBudget(+e.target.value)}
                        className="w-full accent-indigo-600" />
                </div>
                <button 
                    disabled={!selectedCity} 
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 flex justify-center items-center gap-2 hover:shadow-xl transition-all hover-lift"
                >
                    <Search className="w-5 h-5" /> Search Now <ChevronRight className="w-5 h-5" />
                </button>
            </motion.form>

            {/* Testimonials */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-20 w-full max-w-2xl"
            >
                <h3 className="text-2xl font-bold mb-8">What Our Users Say</h3>
                <div className="relative h-40">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ 
                                opacity: activeTestimonial === idx ? 1 : 0,
                                x: activeTestimonial === idx ? 0 : 50,
                                display: activeTestimonial === idx ? 'block' : 'none'
                            }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-indigo-50 p-8 rounded-2xl border-2 border-indigo-200"
                        >
                            <div className="flex gap-1 mb-3 justify-center">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-lg text-stone-700 mb-4 italic">"{testimonial.text}"</p>
                            <p className="font-bold text-indigo-600">— {testimonial.name}</p>
                        </motion.div>
                    ))}
                </div>
                <div className="flex gap-2 justify-center mt-6">
                    {testimonials.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveTestimonial(idx)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                activeTestimonial === idx ? "bg-indigo-600 w-8" : "bg-stone-300"
                            )}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LandingView;
