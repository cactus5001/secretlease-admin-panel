
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Bitcoin, Wallet } from 'lucide-react';
import { type AdminConfig } from '../types';
import { cn } from '../lib/utils';

type PaymentMethod = 'paypal' | 'btc' | 'usdt';

interface PaymentViewProps {
    handlePayment: () => void;
    adminConfig: AdminConfig;
    selectedPaymentMethod: PaymentMethod;
    setSelectedPaymentMethod: (method: PaymentMethod) => void;
}

const PaymentView: React.FC<PaymentViewProps> = ({ handlePayment, adminConfig, selectedPaymentMethod, setSelectedPaymentMethod }) => {
    return (
        <motion.div
            key="payment"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-[80vh] flex items-center justify-center p-4"
        >
            <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-stone-100 flex flex-col md:flex-row">
                <div className="bg-stone-900 p-8 text-white md:w-5/12 flex flex-col justify-between">
                    <div>
                        <ShieldCheck className="w-10 h-10 text-indigo-400 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Lifetime Access</h3>
                        <p className="text-indigo-200 text-sm">One-time payment. Unlimited searches. Instant access.</p>
                    </div>
                    <div className="mt-10">
                        <div className="text-5xl font-black">${adminConfig.priceUsd}</div>
                    </div>
                </div>
                <div className="p-8 md:w-7/12">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h3>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {(['paypal', 'btc', 'usdt'] as const).map(m => (
                            <button key={m} onClick={() => setSelectedPaymentMethod(m)}
                                className={cn("p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all",
                                    selectedPaymentMethod === m ? "border-indigo-600 bg-indigo-50" : "border-stone-200 hover:border-stone-300")}>
                                {m === 'paypal' && <span className="font-bold text-blue-800 italic">Pay<span className="text-blue-500">Pal</span></span>}
                                {m === 'btc' && <Bitcoin className="w-6 h-6 text-orange-500" />}
                                {m === 'usdt' && <Wallet className="w-6 h-6 text-green-500" />}
                                <span className="text-[10px] font-bold uppercase">{m}</span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-stone-50 p-4 rounded-xl mb-6 text-sm">
                        {selectedPaymentMethod === 'paypal' && (
                            <p>You will be redirected to PayPal to securely complete your ${adminConfig.priceUsd} payment to <strong>{adminConfig.paypalEmail}</strong>.</p>
                        )}
                        {(selectedPaymentMethod === 'btc' || selectedPaymentMethod === 'usdt') && (
                            <div className="space-y-2">
                                <p className="font-bold">Send exact amount to:</p>
                                <div className="font-mono text-xs break-all bg-white p-2 rounded border select-all">
                                    {selectedPaymentMethod === 'btc' ? adminConfig.btcAddress : adminConfig.usdtAddress}
                                </div>
                                <p className="text-xs text-stone-500">Account unlocks after 1 confirmation.</p>
                            </div>
                        )}
                    </div>

                    <button onClick={handlePayment} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-colors">
                        {selectedPaymentMethod === 'paypal' ? 'Pay Now' : 'I Have Sent Payment'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PaymentView;
