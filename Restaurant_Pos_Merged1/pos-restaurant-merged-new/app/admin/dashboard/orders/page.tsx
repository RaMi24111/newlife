"use client";

import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowLeft, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { OrdersProvider, useOrders } from '../../contexts/OrdersContext';
import OrdersTable from '../../components/orders/OrdersTable';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';
import { Order, OrderType, OrderStatus, PaymentStatus } from '../../lib/orders.service';

function OrdersManagementContent() {
    const { orders, isLoading, error } = useOrders();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL');
    const [typeFilter, setTypeFilter] = useState<OrderType | 'ALL'>('ALL');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [dateFilter, setDateFilter] = useState('');

    // Filter orders
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = !searchQuery ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
            const matchesPayment = paymentFilter === 'ALL' || order.payment_status === paymentFilter;
            const matchesType = typeFilter === 'ALL' || order.order_type === typeFilter;

            const matchesDate = !dateFilter || (() => {
                const orderDate = new Date(order.created_at).toISOString().slice(0, 10);
                return orderDate === dateFilter;
            })();

            return matchesSearch && matchesStatus && matchesPayment && matchesType && matchesDate;
        });
    }, [orders, searchQuery, statusFilter, paymentFilter, typeFilter, dateFilter]);

    const handleViewDetails = (order: Order) => {
        setSelectedOrderId(order.id);
        setShowDetailsModal(true);
    };

    // Stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.PLACED).length,
        completed: orders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.SERVED).length,
        revenue: orders
            .filter(o => o.payment_status === PaymentStatus.PAID)
            .reduce((sum, o) => sum + Number(o.total_amount), 0),
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-paper-white">
                {/* Header */}
                <header className="bg-ruby-red py-8 px-8 shadow-lg border-b-4 border-gold-start">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-semibold border border-white/30"
                            >
                                <ArrowLeft size={20} />
                                Back to Dashboard
                            </Link>
                            <div className="text-center">
                                <h1 className="text-4xl font-serif font-bold text-white mb-2">
                                    Orders Management
                                </h1>
                                <p className="text-gold-start/80">View and track all customer orders</p>
                            </div>
                            <div className="w-48"></div> {/* Spacer for alignment */}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="text-text-muted text-sm mb-1">Total Orders</div>
                            <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="text-text-muted text-sm mb-1">Total Revenue</div>
                            <div className="text-2xl font-bold text-ruby-red">₹{stats.revenue.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={20} className="text-text-muted" />
                            <h3 className="font-semibold text-text-primary">Filters</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by Order ID..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            >
                                <option value="ALL">All Status</option>
                                <option value={OrderStatus.PLACED}>Placed</option>
                                <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                                <option value={OrderStatus.PREPARING}>Preparing</option>
                                <option value={OrderStatus.READY}>Ready</option>
                                <option value={OrderStatus.SERVED}>Served</option>
                                <option value={OrderStatus.CANCELLED}>Cancelled</option>
                            </select>

                            {/* Payment Filter */}
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | 'ALL')}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            >
                                <option value="ALL">All Payments</option>
                                <option value={PaymentStatus.PENDING}>Pending</option>
                                <option value={PaymentStatus.PAID}>Paid</option>
                                <option value={PaymentStatus.FAILED}>Failed</option>
                            </select>

                            {/* Type Filter */}
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as OrderType | 'ALL')}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            >
                                <option value="ALL">All Types</option>
                                <option value={OrderType.DINE_IN}>Dine-In</option>
                                <option value={OrderType.TAKEAWAY}>Takeaway</option>
                                <option value={OrderType.DELIVERY}>Delivery</option>
                            </select>

                            {/* Date Filter */}
                            <div className="relative flex items-center">
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full px-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                />
                                {dateFilter && (
                                    <button
                                        onClick={() => setDateFilter('')}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        title="Clear date filter"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Orders Count */}
                    <div className="mb-4">
                        <p className="text-text-muted">
                            Showing <span className="font-semibold text-text-primary">{filteredOrders.length}</span> order{filteredOrders.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Orders Table */}
                    {isLoading ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    ) : (
                        <OrdersTable
                            orders={filteredOrders}
                            onViewDetails={handleViewDetails}
                        />
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedOrderId(null);
                }}
                orderId={selectedOrderId}
            />
        </ProtectedRoute>
    );
}

export default function OrdersManagementPage() {
    return (
        <OrdersProvider>
            <OrdersManagementContent />
        </OrdersProvider>
    );
}
