
import React from 'react';
import { Building2, LogIn, LogOut } from 'lucide-react';
import { type UserAccount, type ViewState } from '../types';

interface HeaderProps {
    currentUser: UserAccount | null;
    handleLogout: () => void;
    setView: (view: ViewState) => void;
    setAuthMode: (mode: 'login' | 'signup') => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, handleLogout, setView, setAuthMode }) => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
                    <Building2 className="h-6 w-6 text-indigo-600" />
                    <span className="font-bold text-xl tracking-tight">SecretLease</span>
                </div>
                <div className="flex items-center gap-4">
                    {currentUser ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium hidden md:block">{currentUser.email}</span>
                            {currentUser.role === 'admin' && (
                                <button onClick={() => setView('admin')} className="text-sm bg-stone-900 text-white px-3 py-1 rounded-full">
                                    Admin
                                </button>
                            )}
                            <button onClick={handleLogout} className="text-stone-500 hover:text-stone-900">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setAuthMode('login'); setView('auth'); }}
                            className="text-sm font-bold text-stone-700 hover:text-indigo-600 flex items-center gap-1"
                        >
                            <LogIn className="w-4 h-4" /> Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
