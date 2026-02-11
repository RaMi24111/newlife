"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    backHref?: string;
    showAdminProfile?: boolean;
}

export function DashboardHeader({ title, subtitle, showBackButton = false, backHref = '/dashboard', showAdminProfile = false }: DashboardHeaderProps) {
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        // Clear any mock session state if needed
        router.push('/admin/login/admin');
    };

    return (
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                {showBackButton && (
                    <Link href={backHref}>
                        <button className="p-2 rounded-lg bg-card-white border border-gold-start/20 hover:bg-gold-start/10 hover:border-gold-start/40 transition-all text-ruby-red">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                )}
                <div>
                    <h1 className="text-4xl font-serif font-bold text-ruby-red">{title}</h1>
                    {subtitle && <p className="text-text-muted">{subtitle}</p>}
                </div>
            </div>

            {/* Admin Profile Dropdown - Only show if showAdminProfile is true */}
            {showAdminProfile && (
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card-white border border-gold-start/20 hover:bg-gold-start/10 hover:border-gold-start/40 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-ruby-red flex items-center justify-center text-white">
                            <User size={18} />
                        </div>
                        <span className="font-semibold text-text-dark">Admin</span>
                    </button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <>
                                {/* Backdrop to close menu */}
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
                                        <p className="font-semibold text-text-dark">Admin</p>
                                        <p className="text-xs text-text-muted">admin@restaurant.com</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left hover:bg-ruby-red/5 transition-colors flex items-center gap-2 text-ruby-red font-semibold"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
