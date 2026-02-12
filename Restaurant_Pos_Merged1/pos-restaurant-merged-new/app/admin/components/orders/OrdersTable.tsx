"use client";

import React from 'react';
import { Eye, Package, CreditCard, Clock } from 'lucide-react';
import { Order, OrderType, OrderStatus, PaymentStatus } from '../../lib/orders.service';

interface OrdersTableProps {
    orders: Order[];
    onViewDetails: (order: Order) => void;
}

export default function OrdersTable({ orders, onViewDetails }: OrdersTableProps) {
    const getOrderTypeBadge = (type: OrderType) => {
        const badges = {
            [OrderType.DINE_IN]: 'bg-blue-100 text-blue-800 border-blue-300',
            [OrderType.TAKEAWAY]: 'bg-purple-100 text-purple-800 border-purple-300',
            [OrderType.DELIVERY]: 'bg-green-100 text-green-800 border-green-300',
        };
        return badges[type] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getOrderTypeLabel = (type: OrderType) => {
        const labels = {
            [OrderType.DINE_IN]: 'Dine-In',
            [OrderType.TAKEAWAY]: 'Takeaway',
            [OrderType.DELIVERY]: 'Delivery',
        };
        return labels[type] || type;
    };

    const getStatusBadge = (status: OrderStatus) => {
        const badges = {
            [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-300',
            [OrderStatus.PREPARING]: 'bg-orange-100 text-orange-800 border-orange-300',
            [OrderStatus.READY]: 'bg-purple-100 text-purple-800 border-purple-300',
            [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-300',
            [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-300',
        };
        return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getStatusLabel = (status: OrderStatus) => {
        return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
    };

    const getPaymentStatusBadge = (status: PaymentStatus) => {
        const badges = {
            [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [PaymentStatus.PAID]: 'bg-green-100 text-green-800 border-green-300',
            [PaymentStatus.FAILED]: 'bg-red-100 text-red-800 border-red-300',
        };
        return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getPaymentStatusLabel = (status: PaymentStatus) => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                <div className="text-gray-300 mb-4">
                    <Package size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                    No orders found
                </h3>
                <p className="text-text-muted">
                    Orders will appear here once customers start placing them
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Total Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Payment
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="transition-colors hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-mono text-sm font-semibold text-text-primary">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getOrderTypeBadge(
                                            order.order_type
                                        )}`}
                                    >
                                        {getOrderTypeLabel(order.order_type)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                            order.status
                                        )}`}
                                    >
                                        {getStatusLabel(order.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-lg font-bold text-ruby-red">
                                        ${Number(order.total_amount).toFixed(2)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusBadge(
                                            order.payment_status
                                        )}`}
                                    >
                                        <CreditCard size={14} className="mr-1" />
                                        {getPaymentStatusLabel(order.payment_status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-text-muted text-sm">
                                        <Clock size={16} />
                                        {formatDate(order.created_at)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => onViewDetails(order)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
