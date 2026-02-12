"use client";

import React, { useState, useMemo } from 'react';
import { Search, Package, DollarSign, CheckCircle, Clock } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { OrdersProvider, useOrders } from '../../contexts/OrdersContext';
import OrdersTable from '../../components/orders/OrdersTable';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';
import { Order, OrderStatus, PaymentStatus, OrderType } from '../../lib/orders.service';

function OrdersManagementContent() {
    const { orders, isLoading, error } = useOrders();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL');
    const [typeFilter, setTypeFilter] = useState<OrderType | 'ALL'>('ALL');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Filter orders
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = !searchQuery ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
            const matchesPayment = paymentFilter === 'ALL' || order.payment_status === paymentFilter;
            const matchesType = typeFilter === 'ALL' || order.order_type === typeFilter;

            return matchesSearch && matchesStatus && matchesPayment && matchesType;
        });
    }, [orders, searchQuery, statusFilter, paymentFilter, typeFilter]);

    const handleViewDetails = (order: Order) => {
        setSelectedOrderId(order.id);
        setShowDetailsModal(true);
    };

    // Stats
    const stats = {
        total: orders.length,
        completed: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
        pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
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
                            <div>
                                <h1 className="text-4xl font-serif font-bold text-white mb-2">
                                    Orders Management
                                </h1>
                                <p className="text-gold-start/80">View and track all customer orders</p>
                            </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Package className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <div className="text-text-muted text-sm mb-1">Total Orders</div>
                                    <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <CheckCircle className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <div className="text-text-muted text-sm mb-1">Completed</div>
                                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-yellow-100 p-3 rounded-full">
                                    <Clock className="text-yellow-600" size={24} />
                                </div>
                                <div>
                                    <div className="text-text-muted text-sm mb-1">Pending</div>
                                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-ruby-red/10 p-3 rounded-full">
                                    <DollarSign className="text-ruby-red" size={24} />
                                </div>
                                <div>
                                    <div className="text-text-muted text-sm mb-1">Total Revenue</div>
                                    <div className="text-2xl font-bold text-ruby-red">${stats.revenue.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                <option value={OrderStatus.PENDING}>Pending</option>
                                <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                                <option value={OrderStatus.PREPARING}>Preparing</option>
                                <option value={OrderStatus.READY}>Ready</option>
                                <option value={OrderStatus.COMPLETED}>Completed</option>
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
