"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuperAdminDashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("superadmin_token");
        if (!token) {
            router.push("/super-admin/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FBF6EE]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B1F1F] mx-auto"></div>
                    <p className="mt-4 text-[#7B1F1F]">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    const dashboardCards = [
        {
            title: "Analytics",
            description: "View platform-wide insights and performance metrics",
            href: "/super-admin/dashboard/analytics",
            icon: "📊",
            color: "#7B1F1F",
        },
        {
            title: "Restaurants",
            description: "Manage all restaurants on the platform",
            href: "/super-admin/dashboard/restaurants",
            icon: "🏪",
            color: "#C8A951",
        },
        {
            title: "Owners",
            description: "Manage restaurant owners and their accounts",
            href: "/super-admin/dashboard/owners",
            icon: "👥",
            color: "#7B1F1F",
        },
        {
            title: "Settings",
            description: "Configure platform settings and preferences",
            href: "/super-admin/dashboard/settings",
            icon: "⚙️",
            color: "#C8A951",
        },
    ];

    return (
        <div className="min-h-screen bg-[#FBF6EE] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1
                        className="text-4xl font-bold mb-2"
                        style={{ color: "#3B0A0D", fontFamily: "var(--font-heading)" }}
                    >
                        Super Admin Dashboard
                    </h1>
                    <p className="text-lg text-[#7B1F1F]">
                        Welcome to the central control panel
                    </p>
                </div>

                {/* Dashboard Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardCards.map((card) => (
                        <Link key={card.href} href={card.href}>
                            <div
                                className="bg-white rounded-xl p-6 border transition-all duration-300 hover:scale-105 cursor-pointer h-full"
                                style={{
                                    borderColor: "#C8A951",
                                    boxShadow: "0 0 20px rgba(200,169,81,0.3)",
                                }}
                            >
                                <div className="text-4xl mb-4">{card.icon}</div>
                                <h3
                                    className="text-xl font-semibold mb-2"
                                    style={{ color: card.color }}
                                >
                                    {card.title}
                                </h3>
                                <p className="text-sm text-[#7B1F1F]">{card.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-12">
                    <h2
                        className="text-2xl font-semibold mb-6"
                        style={{ color: "#3B0A0D" }}
                    >
                        Quick Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div
                            className="bg-white rounded-xl p-6 border"
                            style={{
                                borderColor: "#C8A951",
                                boxShadow: "0 0 18px rgba(200,169,81,0.4)",
                            }}
                        >
                            <p className="text-sm text-[#7B1F1F] mb-2">Platform Status</p>
                            <p className="text-3xl font-bold text-[#3B0A0D]">Active</p>
                            <p className="text-xs text-[#7B1F1F] mt-2">All systems operational</p>
                        </div>

                        <div
                            className="bg-white rounded-xl p-6 border"
                            style={{
                                borderColor: "#C8A951",
                                boxShadow: "0 0 18px rgba(200,169,81,0.4)",
                            }}
                        >
                            <p className="text-sm text-[#7B1F1F] mb-2">Total Restaurants</p>
                            <p className="text-3xl font-bold text-[#3B0A0D]">-</p>
                            <p className="text-xs text-[#7B1F1F] mt-2">View in Analytics</p>
                        </div>

                        <div
                            className="bg-white rounded-xl p-6 border"
                            style={{
                                borderColor: "#C8A951",
                                boxShadow: "0 0 18px rgba(200,169,81,0.4)",
                            }}
                        >
                            <p className="text-sm text-[#7B1F1F] mb-2">Total Owners</p>
                            <p className="text-3xl font-bold text-[#3B0A0D]">-</p>
                            <p className="text-xs text-[#7B1F1F] mt-2">View in Analytics</p>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => {
                            localStorage.removeItem("superadmin_token");
                            localStorage.removeItem("role");
                            router.push("/super-admin/login");
                        }}
                        className="px-6 py-3 rounded-lg text-white font-medium transition-all hover:scale-105"
                        style={{
                            backgroundColor: "#7B1F1F",
                            boxShadow: "0 0 18px rgba(123,31,31,0.5)",
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
