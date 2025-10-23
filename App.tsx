import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  type ViewState, type City, type RentalListing, type UserAccount, type Transaction, type AdminConfig
} from './types';
import {
  ALL_LISTINGS, DEFAULT_CONFIG
} from './data/mockData';
import { authAPI, adminAPI, getToken } from './services/api';

import Header from './components/Header';
import LandingView from './components/LandingView';
import SearchingView from './components/SearchingView';
import AuthView from './components/AuthView';
import ResultsView from './components/ResultsView';
import PaymentView from './components/PaymentView';
import SuccessView from './components/SuccessView';
import AdminPanel from './components/AdminPanel';
import PendingApprovalView from './components/PendingApprovalView';
import Toast, { type ToastMessage } from './components/Toast';

export default function App() {
  // --- GLOBAL STATE ---
  const [view, setView] = useState<ViewState>('landing');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(DEFAULT_CONFIG);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  // --- SEARCH STATE ---
  const [selectedCity, setSelectedCity] = useState<City>('');
  const [maxBudget, setMaxBudget] = useState<number>(2000);
  const [results, setResults] = useState<RentalListing[]>([]);
  const [loadingText, setLoadingText] = useState('Initializing...');

  // --- AUTH/PAYMENT STATE ---
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'btc' | 'usdt'>('paypal');

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      const savedUser = localStorage.getItem('secretlease_user');
      
      if (token && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          
          // Set appropriate view based on user state
          if (user.role === 'admin') {
            setView('admin');
          } else if (user.isApproved !== false && user.hasPaid) {
            setView('landing');
          } else {
            setView('pendingApproval');
          }
          
          console.log('[App] Session restored for:', user.email);
        } catch (error) {
          console.error('[App] Failed to restore session:', error);
          localStorage.removeItem('secretlease_user');
        }
      }
      
      setIsRestoringSession(false);
    };
    
    restoreSession();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity) return;
    setView('searching');

    const msgs = ['Connecting to private databases...', 'Bypassing broker listings...', 'Filtering off-market deals...', 'Finalizing...'];
    msgs.forEach((msg, i) => setTimeout(() => setLoadingText(msg), i * 800));

    setTimeout(() => {
      let matches = ALL_LISTINGS.filter(l => l.city === selectedCity && l.price <= maxBudget);
      matches = matches.sort(() => Math.random() - 0.5);
      setResults(matches.slice(0, 60));
      setView('results');
      addToast('success', `Found ${matches.slice(0, 60).length} matching properties!`);
    }, 3500);
  };

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAuth = async (e: React.FormEvent, paymentDetails?: {
    paymentMethod: 'paypal' | 'btc' | 'usdt';
    paymentEmail?: string;
    walletAddress?: string;
    transactionHash: string;
  }) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const response = await authAPI.login(authEmail, authPass);
        const user = response.data.user;
        
        setCurrentUser(user);
        localStorage.setItem('secretlease_user', JSON.stringify(user));
        addToast('success', `Welcome back, ${user.email}!`);
        
        if (user.role === 'admin') {
          setView('admin');
        } else if (user.isApproved !== false && user.hasPaid) {
          setView(results.length > 0 ? 'results' : 'landing');
        } else {
          setView('pendingApproval');
        }
      } else {
        // Signup flow
        if (!paymentDetails) {
          setAuthError('Payment details are required');
          setIsLoading(false);
          return;
        }

        const response = await authAPI.register({
          email: authEmail,
          password: authPass,
          paymentMethod: paymentDetails.paymentMethod,
          paymentEmail: paymentDetails.paymentEmail,
          walletAddress: paymentDetails.walletAddress,
          transactionHash: paymentDetails.transactionHash
        });

        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('secretlease_user', JSON.stringify(user));
        addToast('success', 'Signup submitted! Awaiting admin approval.');
        setView('pendingApproval');
      }
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
      addToast('error', error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (!currentUser) return;
    
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      amount: adminConfig.priceUsd,
      method: selectedPaymentMethod,
      date: new Date().toISOString(),
      status: 'pending'
    };
    setTransactions([newTx, ...transactions]);
    addToast('info', 'Payment submitted for approval');
    setView('pendingApproval');
  };

  const handleApproveTransaction = (transactionId: string) => {
    let approvedUserId: string | null = null;
    
    const updatedTransactions = transactions.map(tx => {
        if (tx.id === transactionId && tx.status === 'pending') {
            approvedUserId = tx.userId;
            return { ...tx, status: 'completed' as const };
        }
        return tx;
    });

    if (approvedUserId) {
        const updatedUsers = users.map(user => {
            if (user.id === approvedUserId) {
                return { ...user, hasPaid: true };
            }
            return user;
        });
        
        if (currentUser && currentUser.id === approvedUserId) {
            setCurrentUser(prev => prev ? { ...prev, hasPaid: true } : null);
        }

        setTransactions(updatedTransactions);
        setUsers(updatedUsers);
        addToast('success', 'Transaction approved successfully');
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await adminAPI.approveUser(userId);
      
      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return { ...user, isApproved: true, hasPaid: true };
        }
        return user;
      });
      
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(prev => prev ? { ...prev, isApproved: true, hasPaid: true } : null);
      }

      setUsers(updatedUsers);
      addToast('success', 'User approved successfully!');
    } catch (error: any) {
      addToast('error', error.message || 'Failed to approve user');
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      await adminAPI.rejectUser(userId);
      
      // Update local state
      const updatedUsers = users.filter(user => user.id !== userId);
      
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(null);
        setView('landing');
      }

      setUsers(updatedUsers);
      addToast('warning', 'User signup rejected and removed');
    } catch (error: any) {
      addToast('error', error.message || 'Failed to reject user');
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    localStorage.removeItem('secretlease_user');
    setCurrentUser(null);
    setView('landing');
    setAuthEmail('');
    setAuthPass('');
    setResults([]);
    addToast('info', 'Logged out successfully');
  };

  const isBlurred = currentUser?.role !== 'admin' && (!currentUser?.hasPaid || currentUser?.isApproved === false);

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingView handleSearch={handleSearch} selectedCity={selectedCity} setSelectedCity={setSelectedCity} maxBudget={maxBudget} setMaxBudget={setMaxBudget} />;
      case 'searching':
        return <SearchingView loadingText={loadingText} />;
      case 'results':
        return <ResultsView results={results} currentUser={currentUser} isBlurred={isBlurred} selectedCity={selectedCity} maxBudget={maxBudget} adminConfig={adminConfig} setView={setView} />;
      case 'auth':
        return <AuthView handleAuth={handleAuth} authMode={authMode} setAuthMode={setAuthMode} authEmail={authEmail} setAuthEmail={setAuthEmail} authPass={authPass} setAuthPass={setAuthPass} authError={authError} setAuthError={setAuthError} adminConfig={adminConfig} />;
      case 'payment':
        return currentUser ? <PaymentView handlePayment={handlePayment} adminConfig={adminConfig} selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} /> : <LandingView handleSearch={handleSearch} selectedCity={selectedCity} setSelectedCity={setSelectedCity} maxBudget={maxBudget} setMaxBudget={setMaxBudget} />;
      case 'success':
        return <SuccessView setView={setView} />;
      case 'pendingApproval':
        return <PendingApprovalView />;
      case 'admin':
        return currentUser?.role === 'admin' ? <AdminPanel handleLogout={handleLogout} users={users} transactions={transactions} adminConfig={adminConfig} setAdminConfig={setAdminConfig} handleApproveTransaction={handleApproveTransaction} handleApproveUser={handleApproveUser} handleRejectUser={handleRejectUser} /> : <LandingView handleSearch={handleSearch} selectedCity={selectedCity} setSelectedCity={setSelectedCity} maxBudget={maxBudget} setMaxBudget={setMaxBudget} />;
      default:
        return <LandingView handleSearch={handleSearch} selectedCity={selectedCity} setSelectedCity={setSelectedCity} maxBudget={maxBudget} setMaxBudget={setMaxBudget} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-indigo-500/20">
      {isRestoringSession ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-stone-600 font-medium">Restoring session...</p>
          </div>
        </div>
      ) : (
        <>
          {view !== 'admin' && (
            <Header currentUser={currentUser} handleLogout={handleLogout} setView={setView} setAuthMode={setAuthMode} />
          )}
          <main>
            <AnimatePresence mode="wait">
              {renderView()}
            </AnimatePresence>
          </main>
          <Toast toasts={toasts} removeToast={removeToast} />
        </>
      )}
    </div>
  );
}