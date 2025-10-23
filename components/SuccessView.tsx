
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { type ViewState } from '../types';

interface SuccessViewProps {
    setView: (view: ViewState) => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ setView }) => {
    return (
        <motion.div
            key="success"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-[80vh] flex flex-col items-center justify-center text-center p-4"
        >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4">You're In!</h2>
            <p className="text-stone-600 mb-8">Your account has been upgraded. Happy hunting.</p>
            <button onClick={() => setView('results')} className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                View Unlocked Listings
            </button>
        </motion.div>
    );
};

export default SuccessView;
