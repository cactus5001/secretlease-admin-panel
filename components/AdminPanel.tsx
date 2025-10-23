import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
    LayoutDashboard, Users, Receipt, Settings, LogOut, ShieldCheck, CheckCircle2, Clock, AlertCircle, Loader2
} from 'lucide-react';
import { type UserAccount, type Transaction, type AdminConfig } from '../types';
import { cn } from '../lib/utils';
import { adminAPI } from '../services/api';

type AdminTab = 'dashboard' | 'users' | 'pendingSignups' | 'transactions' | 'settings';

interface AdminPanelProps {
    handleLogout: () => void;
    users: UserAccount[];
    transactions: Transaction[];
    adminConfig: AdminConfig;
    setAdminConfig: React.Dispatch<React.SetStateAction<AdminConfig>>;
    handleApproveTransaction: (transactionId: string) => void;
    handleApproveUser?: (userId: string) => void;
    handleRejectUser?: (userId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    handleLogout, 
    users, 
    transactions, 
    adminConfig, 
    setAdminConfig, 
    handleApproveTransaction,
    handleApproveUser,
    handleRejectUser
}) => {
    const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
    const [pendingSignups, setPendingSignups] = useState<UserAccount[]>([]);
    const [isLoadingSignups, setIsLoadingSignups] = useState(false);
    const pendingCount = transactions.filter(t => t.status === 'pending').length;
    const pendingSignupsCount = pendingSignups.length;

    // Fetch pending signups when pendingSignups tab is active OR on initial load
    useEffect(() => {
        if (adminTab === 'pendingSignups') {
            fetchPendingSignups();
        }
    }, [adminTab]);

    // Also fetch on component mount for dashboard badge
    useEffect(() => {
        fetchPendingSignups();
    }, []);

    const fetchPendingSignups = async () => {
        setIsLoadingSignups(true);
        try {
            console.log('[AdminPanel] Fetching pending signups...');
            const response = await adminAPI.getPendingSignups();
            console.log('[AdminPanel] Pending signups response:', response);
            setPendingSignups(response.data || []);
            console.log('[AdminPanel] Set pending signups count:', response.data?.length || 0);
        } catch (error) {
            console.error('[AdminPanel] Failed to fetch pending signups:', error);
            setPendingSignups([]);
        } finally {
            setIsLoadingSignups(false);
        }
    };

    const handleApprove = async (userId: string) => {
        if (handleApproveUser) {
            await handleApproveUser(userId);
            // Refresh pending signups list
            fetchPendingSignups();
        }
    };

    const handleReject = async (userId: string) => {
        if (handleRejectUser) {
            await handleRejectUser(userId);
            // Refresh pending signups list
            fetchPendingSignups();
        }
    };

    return (
        <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-stone-100 flex"
        >
            <div className="w-64 bg-stone-900 text-indigo-100 p-6 flex-col hidden md:flex">
                <div className="text-2xl font-bold text-white mb-10 flex items-center gap-2"><ShieldCheck className="text-indigo-500" /> Admin</div>
                <nav className="space-y-2 flex-1">
                    {[
                        { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'users', icon: Users, label: 'Users' },
                        { id: 'pendingSignups', icon: Clock, label: 'Pending Signups', badge: pendingSignupsCount },
                        { id: 'transactions', icon: Receipt, label: 'Transactions' },
                        { id: 'settings', icon: Settings, label: 'Settings' }
                    ].map(item => (
                        <button key={item.id} onClick={() => setAdminTab(item.id as AdminTab)}
                            className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative",
                                adminTab === item.id ? "bg-indigo-600 text-white" : "hover:bg-stone-800")}>
                            <item.icon className="w-5 h-5" /> {item.label}
                            {item.badge && item.badge > 0 && (
                                <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-white transition-colors">
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold text-stone-900 mb-8 capitalize">{adminTab}</h2>

                {adminTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                            <h3 className="text-stone-500 font-medium mb-2">Total Revenue</h3>
                            <p className="text-4xl font-black">${transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                            <h3 className="text-stone-500 font-medium mb-2">Total Users</h3>
                            <p className="text-4xl font-black">{users.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                            <h3 className="text-stone-500 font-medium mb-2 flex items-center gap-2">
                               Pending Signups {pendingSignupsCount > 0 && <AlertCircle className="w-4 h-4 text-amber-500" />}
                            </h3>
                            <p className={`text-4xl font-black ${pendingSignupsCount > 0 ? 'text-amber-600' : ''}`}>{pendingSignupsCount}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                            <h3 className="text-stone-500 font-medium mb-2">Conversion Rate</h3>
                            <p className="text-4xl font-black">
                                {users.length > 0 ? Math.round((users.filter(u => u.hasPaid).length / users.length) * 100) : 0}%
                            </p>
                        </div>
                    </div>
                )}

                {adminTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-x-auto">
                        <table className="w-full text-left min-w-max">
                            <thead className="bg-stone-50 border-b border-stone-200">
                                <tr>
                                    <th className="p-4 text-sm font-bold text-stone-600">Email</th>
                                    <th className="p-4 text-sm font-bold text-stone-600">Role</th>
                                    <th className="p-4 text-sm font-bold text-stone-600">Status</th>
                                    <th className="p-4 text-sm font-bold text-stone-600">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50">
                                        <td className="p-4 font-medium">{u.email}</td>
                                        <td className="p-4"><span className={`text-xs uppercase font-bold px-2 py-1 rounded ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-stone-100 text-stone-600'}`}>{u.role}</span></td>
                                        <td className="p-4">
                                            {u.hasPaid ?
                                                <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3" /> Paid</span> :
                                                <span className="text-stone-500 bg-stone-100 px-2 py-1 rounded-full text-xs font-bold">Free</span>}
                                        </td>
                                        <td className="p-4 text-stone-500 text-sm">{format(new Date(u.joinedDate), 'MMM dd, yyyy')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {adminTab === 'pendingSignups' && (
                    <div className="space-y-4">
                        {isLoadingSignups ? (
                            <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-200 text-center">
                                <Loader2 className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-spin" />
                                <p className="text-stone-500 text-lg">Loading pending signups...</p>
                            </div>
                        ) : pendingSignupsCount === 0 ? (
                            <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-200 text-center">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <p className="text-stone-500 text-lg">No pending signups</p>
                            </div>
                        ) : (
                            pendingSignups.map(u => (
                                <div key={u.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-amber-500" />
                                                New Signup Request
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="text-stone-500">Email:</span>
                                                    <p className="font-semibold">{u.email}</p>
                                                </div>
                                                <div>
                                                    <span className="text-stone-500">Joined:</span>
                                                    <p className="font-semibold">{u.joinedDate ? format(new Date(u.joinedDate), 'MMM dd, yyyy HH:mm') : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-bold mb-2 text-stone-700">Payment Details</h4>
                                            <div className="space-y-2 text-sm bg-stone-50 p-4 rounded-xl">
                                                <div>
                                                    <span className="text-stone-500">Method:</span>
                                                    <p className="font-semibold uppercase">{u.paymentMethod}</p>
                                                </div>
                                                {u.paymentMethod === 'paypal' && u.paymentEmail && (
                                                    <div>
                                                        <span className="text-stone-500">PayPal Email:</span>
                                                        <p className="font-mono text-xs break-all">{u.paymentEmail}</p>
                                                    </div>
                                                )}
                                                {(u.paymentMethod === 'btc' || u.paymentMethod === 'usdt') && u.walletAddress && (
                                                    <div>
                                                        <span className="text-stone-500">Wallet Address:</span>
                                                        <p className="font-mono text-xs break-all">{u.walletAddress}</p>
                                                    </div>
                                                )}
                                                {u.transactionHash && (
                                                    <div>
                                                        <span className="text-stone-500">Transaction Hash:</span>
                                                        <p className="font-mono text-xs break-all">{u.transactionHash}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3 mt-6">
                                        <button 
                                            onClick={() => handleApprove(u.id)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            Approve & Activate
                                        </button>
                                        <button 
                                            onClick={() => handleReject(u.id)}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <AlertCircle className="w-5 h-5" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {adminTab === 'transactions' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-x-auto">
                        <table className="w-full text-left min-w-max">
                            <thead className="bg-stone-50 border-b border-stone-200">
                                <tr>
                                    <th className="p-4 text-sm font-bold text-stone-600">Date</th>
                                    <th className="p-4 text-sm font-bold text-stone-600">User</th>
                                    <th className="p-4 text-sm font-bold text-stone-600">Amount</th>
                                    <th className="p-4 text-sm font-bold text-stone-600">Method</th>
                                    <th className="p-4 text-sm font-bold text-stone-600">Status</th>
                                    <th className="p-4 text-sm font-bold text-stone-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t.id} className="border-b border-stone-100 hover:bg-stone-50">
                                        <td className="p-4 text-stone-500 text-sm">{format(new Date(t.date), 'MMM dd HH:mm')}</td>
                                        <td className="p-4 font-medium">{t.userEmail}</td>
                                        <td className="p-4 font-bold text-green-600">+${t.amount}</td>
                                        <td className="p-4 uppercase text-xs font-bold text-stone-500">{t.method}</td>
                                        <td className="p-4">
                                            {t.status === 'completed' ?
                                                <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3" /> Completed</span> :
                                                <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-bold"><Clock className="w-3 h-3" /> Pending</span>}
                                        </td>
                                        <td className="p-4">
                                            {t.status === 'pending' && (
                                                <button onClick={() => handleApproveTransaction(t.id)} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors">
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {adminTab === 'settings' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 max-w-2xl">
                        <div className="space-y-6">
                            <div>
                                <label className="font-bold text-sm mb-1 block">Membership Price (USD)</label>
                                <input type="number" value={adminConfig.priceUsd} onChange={e => setAdminConfig({ ...adminConfig, priceUsd: +e.target.value })}
                                    className="w-full p-3 border border-stone-200 rounded-xl" />
                            </div>
                            <div>
                                <label className="font-bold text-sm mb-1 block">PayPal Email</label>
                                <input type="text" value={adminConfig.paypalEmail} onChange={e => setAdminConfig({ ...adminConfig, paypalEmail: e.target.value })}
                                    className="w-full p-3 border border-stone-200 rounded-xl" />
                            </div>
                            <div>
                                <label className="font-bold text-sm mb-1 block">Bitcoin Address</label>
                                <input type="text" value={adminConfig.btcAddress} onChange={e => setAdminConfig({ ...adminConfig, btcAddress: e.target.value })}
                                    className="w-full p-3 border border-stone-200 rounded-xl font-mono text-sm" />
                            </div>
                            <div>
                                <label className="font-bold text-sm mb-1 block">USDT (TRC20) Address</label>
                                <input type="text" value={adminConfig.usdtAddress} onChange={e => setAdminConfig({ ...adminConfig, usdtAddress: e.target.value })}
                                    className="w-full p-3 border border-stone-200 rounded-xl font-mono text-sm" />
                            </div>
                            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Save Changes</button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AdminPanel;