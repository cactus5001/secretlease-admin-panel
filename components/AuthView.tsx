
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Wallet, CreditCard, Info } from 'lucide-react';
import type { AdminConfig } from '../types';

interface AuthViewProps {
    handleAuth: (e: React.FormEvent, paymentDetails?: {
        paymentMethod: 'paypal' | 'btc' | 'usdt';
        paymentEmail?: string;
        walletAddress?: string;
        transactionHash: string;
    }) => void;
    authMode: 'login' | 'signup';
    setAuthMode: (mode: 'login' | 'signup') => void;
    authEmail: string;
    setAuthEmail: (email: string) => void;
    authPass: string;
    setAuthPass: (pass: string) => void;
    authError: string;
    setAuthError: (error: string) => void;
    adminConfig: AdminConfig;
}

const AuthView: React.FC<AuthViewProps> = ({
    handleAuth, authMode, setAuthMode, authEmail, setAuthEmail, authPass, setAuthPass, authError, setAuthError, adminConfig
}) => {
    const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'btc' | 'usdt'>('paypal');
    const [paymentEmail, setPaymentEmail] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [transactionHash, setTransactionHash] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (authMode === 'signup') {
            // Validate payment details
            if (paymentMethod === 'paypal' && !paymentEmail) {
                setAuthError('Please enter your PayPal email');
                return;
            }
            if ((paymentMethod === 'btc' || paymentMethod === 'usdt') && !walletAddress) {
                setAuthError('Please enter your wallet address');
                return;
            }
            if (!transactionHash) {
                setAuthError('Please enter the transaction hash');
                return;
            }
            handleAuth(e, { paymentMethod, paymentEmail, walletAddress, transactionHash });
        } else {
            handleAuth(e);
        }
    };

    return (
        <motion.div
            key="auth"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-[80vh] flex items-center justify-center p-4"
        >
            <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl shadow-stone-200/50 border border-stone-100">
                <h2 className="text-3xl font-bold mb-6 text-center">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                
                {authError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {authError}
                    </div>
                )}

                {authMode === 'signup' && (
                    <div className="bg-indigo-50 text-indigo-900 p-4 rounded-lg text-sm mb-6 flex items-start gap-3">
                        <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold mb-1">Payment Required: ${adminConfig.priceUsd}</p>
                            <p className="text-xs text-indigo-700">Send payment first, then complete this form with your payment details. Your account will be activated after admin verification.</p>
                        </div>
                    </div>
                )}
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-stone-700 ml-1">Email</label>
                            <input 
                                type="email" 
                                required 
                                className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 ring-indigo-500 outline-none mt-1"
                                value={authEmail} 
                                onChange={e => setAuthEmail(e.target.value)} 
                                placeholder="you@example.com" 
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-stone-700 ml-1">Password</label>
                            <input 
                                type="password" 
                                required 
                                className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 ring-indigo-500 outline-none mt-1"
                                value={authPass} 
                                onChange={e => setAuthPass(e.target.value)} 
                                placeholder="••••••••" 
                            />
                        </div>
                    </div>

                    {authMode === 'signup' && (
                        <>
                            <div className="border-t border-stone-200 pt-4 mt-6">
                                <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2">
                                    <Wallet className="w-5 h-5" />
                                    Payment Details
                                </h3>
                                
                                <div className="mb-4">
                                    <label className="text-sm font-bold text-stone-700 ml-1 mb-2 block">Payment Method</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('paypal')}
                                            className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                                                paymentMethod === 'paypal'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-stone-200 hover:border-stone-300'
                                            }`}
                                        >
                                            PayPal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('btc')}
                                            className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                                                paymentMethod === 'btc'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-stone-200 hover:border-stone-300'
                                            }`}
                                        >
                                            Bitcoin
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('usdt')}
                                            className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                                                paymentMethod === 'usdt'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-stone-200 hover:border-stone-300'
                                            }`}
                                        >
                                            USDT
                                        </button>
                                    </div>
                                </div>

                                {paymentMethod === 'paypal' && (
                                    <div className="bg-blue-50 p-4 rounded-xl mb-4">
                                        <p className="text-sm font-semibold text-blue-900 mb-2">Send ${adminConfig.priceUsd} to:</p>
                                        <div className="bg-white p-3 rounded-lg font-mono text-sm text-blue-700 break-all">
                                            {adminConfig.paypalEmail}
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'btc' && (
                                    <div className="bg-orange-50 p-4 rounded-xl mb-4">
                                        <p className="text-sm font-semibold text-orange-900 mb-2">Send ${adminConfig.priceUsd} worth of BTC to:</p>
                                        <div className="bg-white p-3 rounded-lg font-mono text-xs text-orange-700 break-all">
                                            {adminConfig.btcAddress}
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'usdt' && (
                                    <div className="bg-green-50 p-4 rounded-xl mb-4">
                                        <p className="text-sm font-semibold text-green-900 mb-2">Send ${adminConfig.priceUsd} USDT to:</p>
                                        <div className="bg-white p-3 rounded-lg font-mono text-xs text-green-700 break-all">
                                            {adminConfig.usdtAddress}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-4">
                                    {paymentMethod === 'paypal' && (
                                        <div>
                                            <label className="text-sm font-bold text-stone-700 ml-1">Your PayPal Email/Username</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 ring-indigo-500 outline-none mt-1"
                                                value={paymentEmail} 
                                                onChange={e => setPaymentEmail(e.target.value)} 
                                                placeholder="The email you sent payment from" 
                                            />
                                        </div>
                                    )}

                                    {(paymentMethod === 'btc' || paymentMethod === 'usdt') && (
                                        <div>
                                            <label className="text-sm font-bold text-stone-700 ml-1">Your Wallet Address</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 ring-indigo-500 outline-none mt-1 font-mono text-sm"
                                                value={walletAddress} 
                                                onChange={e => setWalletAddress(e.target.value)} 
                                                placeholder="The wallet address you sent from" 
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-bold text-stone-700 ml-1">Transaction Hash / ID</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 ring-indigo-500 outline-none mt-1 font-mono text-sm"
                                            value={transactionHash} 
                                            onChange={e => setTransactionHash(e.target.value)} 
                                            placeholder="Transaction hash from your payment" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-colors mt-6">
                        {authMode === 'login' ? 'Login' : 'Submit for Approval'}
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm">
                    <button 
                        onClick={() => { 
                            setAuthMode(authMode === 'login' ? 'signup' : 'login'); 
                            setAuthError(''); 
                        }} 
                        className="text-stone-500 hover:text-indigo-600 underline"
                    >
                        {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default AuthView;
