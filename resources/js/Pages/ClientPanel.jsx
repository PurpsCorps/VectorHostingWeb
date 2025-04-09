import React, { useState, useEffect } from 'react';
import { User, Server, HardDrive, Globe, Clock, CreditCard, Bell, Settings, LogOut, BarChart2, Shield, Activity } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ServicesPage from './ServicesPage';
import BillingPage from './BillingPage';

const ClientPanel = () => {
    const [services, setServices] = useState([]);
    const [stats, setStats] = useState({
        activeServices: 0,
        totalServices: 0,
        upcomingInvoices: 0,
        tickets: 0
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        // Get user from session storage
        const userInfo = sessionStorage.getItem('user');
        if (!userInfo) {
            window.location.href = '/login';
            return;
        }

        setUser(JSON.parse(userInfo));

        // Fetch user services
        const fetchData = async () => {
            try {
                const userObj = JSON.parse(userInfo);
                const response = await axios.get(`/api/services/${userObj.id}/`, {
                    headers: {'X-Requested': import.meta.env.VITE_API_KEY}
                });
                const response2 = await axios.get(`/api/invoices/${userObj.id}/`, {
                    headers: {'X-Requested': import.meta.env.VITE_API_KEY}
                });

                setServices(response.data);
                // Calculate stats
                setStats({
                    activeServices: response.data.filter(service => service.status === 'active').length,
                    totalServices: response.data.length,
                    upcomingInvoices: response2.data.filter(invoice => invoice.status === 'unpaid').length, // This would come from another API call in a real app
                    tickets: 0 // This would come from another API call in a real app
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching services:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handleSelectNew = () => {
        navigate('/product');
    };

    const renderStatusBadge = (status) => {
        const statusClasses = {
            active: "bg-green-500/20 text-green-400 border-green-500/30",
            pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            suspended: "bg-red-500/20 text-red-400 border-red-500/30",
            cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30"
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses[status] || statusClasses.pending}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-lg bg-blue-500/20">
                                        <Server className="text-blue-400" size={24} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-gray-400 text-sm">Active Services</p>
                                        <h3 className="text-2xl font-bold text-white">{stats.activeServices}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-lg bg-purple-500/20">
                                        <Globe className="text-purple-400" size={24} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-gray-400 text-sm">Total Services</p>
                                        <h3 className="text-2xl font-bold text-white">{stats.totalServices}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-lg bg-indigo-500/20">
                                        <CreditCard className="text-indigo-400" size={24} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-gray-400 text-sm">Pending Invoices</p>
                                        <h3 className="text-2xl font-bold text-white">{stats.upcomingInvoices}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-lg bg-green-500/20">
                                        <Bell className="text-green-400" size={24} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-gray-400 text-sm">Active Tickets</p>
                                        <h3 className="text-2xl font-bold text-white">{stats.tickets}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Services Table */}
                        <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Your Services</h2>
                                <button onClick={handleSelectNew} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                                    Order New Service
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-800">
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Service</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Plan</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Next Renewal</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                                            <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="py-4 text-center text-gray-400">Loading services...</td>
                                            </tr>
                                        ) : services.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-4 text-center text-gray-400">No services found. Order your first service to get started.</td>
                                            </tr>
                                        ) : (
                                            services.map((service, index) => (
                                                <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center">
                                                            <div className="p-2 rounded bg-gray-800">
                                                                {service.type === 'vps' && <Server size={20} className="text-blue-400" />}
                                                                {service.type === 'domain' && <Globe size={20} className="text-blue-400" />}
                                                                {service.type === 'hosting' && <Server size={20} className="text-purple-400" />}
                                                                {service.type === 'storage' && <HardDrive size={20} className="text-green-400" />}
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="text-white font-medium">{service.name}</p>
                                                                <p className="text-gray-400 text-sm">{service.domain || service.ip}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-white">{service.plan}</td>
                                                    <td className="py-4 px-4 text-white">{service.renewal_date}</td>
                                                    <td className="py-4 px-4">
                                                        {renderStatusBadge(service.status)}
                                                    </td>
                                                    {service.status === "active" && (
                                                        <td className="py-4 px-4 text-right">
                                                            <button onClick={() => setActiveTab('services')} className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded-lg text-sm transition mr-2">
                                                                Manage
                                                            </button>
                                                            <button className="bg-gray-700/50 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm transition">
                                                                Renew
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Server Status */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
                                <h2 className="text-xl font-bold text-white mb-6">System Status</h2>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300 text-sm">CPU Usage</span>
                                            <span className="text-blue-400 text-sm font-medium">0%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300 text-sm">Memory Usage</span>
                                            <span className="text-purple-400 text-sm font-medium">0%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300 text-sm">Disk Usage</span>
                                            <span className="text-indigo-400 text-sm font-medium">0%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300 text-sm">Bandwidth</span>
                                            <span className="text-green-400 text-sm font-medium">0%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/60 backdrop-blur-md rounded-md p-6 border border-gray-800/80 shadow-md">
                                <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>

                                {/* <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="p-2 rounded-full bg-blue-500/20 mr-3">
                                            <Activity size={16} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm">Server Restarted</p>
                                            <p className="text-gray-400 text-xs">2 hours ago</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="p-2 rounded-full bg-purple-500/20 mr-3">
                                            <Shield size={16} className="text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm">Security Scan Completed</p>
                                            <p className="text-gray-400 text-xs">Yesterday</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="p-2 rounded-full bg-green-500/20 mr-3">
                                            <CreditCard size={16} className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm">Invoice Paid</p>
                                            <p className="text-gray-400 text-xs">3 days ago</p>
                                        </div>
                                    </div>
                                </div> */}

                                <button className="w-full mt-6 text-blue-400 text-sm hover:text-blue-300 transition">
                                    View All Activity
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'services':
                return (
                    // <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
                    //     <h2 className="text-xl font-bold text-white mb-6">Your Services</h2>
                    //     <p className="text-gray-400">Detailed services panel would be shown here.</p>
                    // </div>
                    <ServicesPage/>
                );
            case 'billing':
                return (
                    // <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
                    //     <h2 className="text-xl font-bold text-white mb-6">Billing & Invoices</h2>
                    //     <p className="text-gray-400">Billing information and invoice history would be shown here.</p>
                    // </div>
                    <BillingPage/>
                );
            case 'support':
                return (
                    <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-6">Support Tickets</h2>
                        <p className="text-gray-400">Support ticket system would be shown here.</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
                        <p className="text-gray-400">Account settings would be shown here.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex relative overflow-hidden pt-20">
            {/* Enhanced Background Gradient */}
            <div className="absolute inset-0">
                {/* Primary gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-indigo-900/20"></div>

                {/* Animated glow spots */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                    backgroundImage: 'linear-gradient(to right, #132f4c 1px, transparent 1px), linear-gradient(to bottom, #132f4c 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                    }}>
                </div>
            </div>

            {/* Sidebar - Fixed position */}
            <div className="w-64 h-screen fixed top-20 left-0 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800/50 p-6 flex flex-col z-10">
                {/* Logo */}
                <div className="mb-10">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-indigo-500">
                        Client Panel
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                                    activeTab === 'dashboard'
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-300'
                                }`}
                            >
                                <BarChart2 size={18} className="mr-3" />
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                                    activeTab === 'services'
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-300'
                                }`}
                            >
                                <Server size={18} className="mr-3" />
                                Services
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('billing')}
                                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                                    activeTab === 'billing'
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-300'
                                }`}
                            >
                                <CreditCard size={18} className="mr-3" />
                                Billing
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('support')}
                                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                                    activeTab === 'support'
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-300'
                                }`}
                            >
                                <Bell size={18} className="mr-3" />
                                Support
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                                    activeTab === 'settings'
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-300'
                                }`}
                            >
                                <Settings size={18} className="mr-3" />
                                Settings
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* User Info & Logout */}
                <div className="mt-auto pt-6 border-t border-gray-800/50">
                    {user && (
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center">
                                <User size={20} className="text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-white font-medium">{user.name}</p>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-gray-800/60 transition"
                    >
                        <LogOut size={18} className="mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content - Added left margin to avoid content being hidden behind sidebar */}
            <div className="flex-grow p-8 overflow-auto ml-64">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        {activeTab === 'dashboard' && 'Dashboard'}
                        {activeTab === 'services' && 'Your Services'}
                        {activeTab === 'billing' && 'Billing & Invoices'}
                        {activeTab === 'support' && 'Support Tickets'}
                        {activeTab === 'settings' && 'Account Settings'}
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {activeTab === 'dashboard' && 'Overview of your hosting account'}
                        {activeTab === 'services' && 'Manage your hosting services'}
                        {activeTab === 'billing' && 'Payment history and upcoming invoices'}
                        {activeTab === 'support' && 'Get help with your hosting services'}
                        {activeTab === 'settings' && 'Configure your account preferences'}
                    </p>
                </header>

                {/* Main Content Area */}
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ClientPanel;