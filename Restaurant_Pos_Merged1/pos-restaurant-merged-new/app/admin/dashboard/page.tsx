"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Utensils, LayoutGrid, Receipt, Users, User, LogOut, Building2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from '../components/ProtectedRoute';
import { authService } from '../lib/auth.service';
import { useAuth } from '../contexts/AuthContext';
import { useRestaurant } from '../contexts/RestaurantContext';
import StatusBadge from '../components/StatusBadge';
import WarningBanner from '../components/WarningBanner';

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    href: string;
    description: string;
}

export default function Dashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const { restaurant, isLoading: restaurantLoading } = useRestaurant();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        authService.logout();
    };

    const menuItems: MenuItem[] = [
        {
            title: 'Menu Management',
            icon: <Utensils size={48} />,
            href: '/admin/dashboard/menu',
            description: 'Add, update, or remove menu items.'
        },
        {
            title: 'Staff Management',
            icon: <Users size={48} />,
            href: '/admin/dashboard/staff',
            description: 'Manage billing and serving staff credentials.'
        },
        {
            title: 'Table Details',
            icon: <LayoutGrid size={48} />,
            href: '/admin/dashboard/tables',
            description: 'Configure layout, view status, and QR codes.'
        },
        {
            title: 'Order Bill',
            icon: <Receipt size={48} />,
            href: '/admin/dashboard/orders',
            description: 'View daily orders and billing history.'
        },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen font-sans relative flex flex-col">
                {/* Background Image */}
                <div className="fixed inset-0 z-0">
                    <div className="relative w-full h-full">
                        <img
                            src="/restaurant_hero.png"
                            alt="Background"
                            className="w-full h-full object-cover opacity-20"
                        />
                    </div>
                    <div className="absolute inset-0 bg-paper-white/80"></div>
                </div>

                {/* Header Section */}
                <header className="relative z-10 bg-ruby-red py-12 px-8 shadow-2xl border-b-4 border-gold-start">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-r from-gold-start via-white to-gold-end mb-4 drop-shadow-sm">
                            {restaurant?.name || 'Admin Dashboard'}
                        </h1>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <p className="text-gold-start/80 text-lg tracking-wide uppercase font-semibold">
                                {restaurant?.restaurant_type || 'Oversee your fine dining operations'}
                            </p>
                            {restaurant && !restaurantLoading && (
                                <StatusBadge status={restaurant.status} />
                            )}
                        </div>
                    </div>

                    {/* Admin Profile - Top Right */}
                    <div className="absolute top-6 right-8">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-gold-start flex items-center justify-center text-ruby-red">
                                <User size={18} />
                            </div>
                            <span className="font-semibold text-white">{user?.email || 'Admin'}</span>
                        </button>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowProfileMenu(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-card-white rounded-lg shadow-xl border border-gold-start/20 overflow-hidden z-20"
                                    >
                                        <div className="p-3 border-b border-gold-start/10">
                                            <p className="font-semibold text-text-dark">{user?.name || 'Admin'}</p>
                                            <p className="text-xs text-text-muted">{user?.email || 'admin@restaurant.com'}</p>
                                        </div>
                                        <Link
                                            href="/admin/dashboard/profile"
                                            className="w-full px-4 py-3 text-left hover:bg-ruby-red/5 transition-colors flex items-center gap-2 text-text-dark font-semibold"
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            <Building2 size={16} />
                                            Restaurant Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left hover:bg-ruby-red/5 transition-colors flex items-center gap-2 text-ruby-red font-semibold border-t border-gold-start/10"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Warning Banner for Inactive Status */}
                {restaurant && restaurant.status !== 'ACTIVE' && (
                    <div className="relative z-10 max-w-7xl mx-auto w-full px-8 pt-6">
                        <WarningBanner
                            message={`Your restaurant "${restaurant.name}" is currently inactive. Some features may be limited. Please contact support to activate your account.`}
                            dismissible={true}
                        />
                    </div>
                )}

                {/* Main Content */}
                <div className="relative z-10 flex-1 p-8 md:p-16 flex items-center">
                    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {menuItems.map((item, index) => (
                            <Link href={item.href} key={index}>
                                <motion.div
                                    whileHover={{ y: -10, scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-card-white/90 backdrop-blur-md border border-white/50 p-8 rounded-2xl h-full flex flex-col items-center text-center cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:border-gold-start transition-all duration-300 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-linear-to-br from-gold-start/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="mb-6 text-ruby-red p-5 bg-paper-white rounded-full group-hover:bg-ruby-red group-hover:text-gold-start transition-colors duration-300 shadow-inner relative z-10">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-text-dark group-hover:text-ruby-red transition-colors font-serif relative z-10">{item.title}</h3>
                                    <p className="text-text-muted text-sm leading-relaxed relative z-10">{item.description}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
