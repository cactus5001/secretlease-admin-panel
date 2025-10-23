import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const PendingApprovalView: React.FC = () => {
    return (
        <motion.div
            key="pending"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-[80vh] flex flex-col items-center justify-center text-center p-4"
        >
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-12 h-12 text-amber-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Payment Submitted</h2>
            <p className="text-stone-600 max-w-md">
                Your payment is being reviewed by our team. Access will be granted once it's approved, usually within a few hours.
                You can close this page. Once approved, you'll have full access next time you log in.
            </p>
        </motion.div>
    );
};

export default PendingApprovalView;
