"use client";

import React from 'react';
import { Eye, Package } from 'lucide-react';
import { Order, OrderType, OrderStatus, PaymentStatus } from '../../lib/orders.service';

interface OrdersTableProps {
    orders: Order[];
    onViewDetails: (order: Order) => void;
}

export default function OrdersTable({ orders, onViewDetails }: OrdersTableProps) {
    const getOrderTypeBadge = (type: OrderType) => {
        const styles = {
            [OrderType.DINE_IN]: 'bg-blue-100 text-blue-800 border-blue-300',
            [OrderType.TAKEAWAY]: 'bg-purple-100 text-purple-800 border-purple-300',
            [OrderType.DELIVERY]: 'bg-green-100 text-green-800 border-green-300',
        };
        const labels = {
            [OrderType.DINE_IN]: 'Dine-In',
            [OrderType.TAKEAWAY]: 'Takeaway',
            [OrderType.DELIVERY]: 'Delivery',
        };
        return { style: styles[type], label: labels[type] };
    };

    const getStatusBadge = (status: OrderStatus) => {
        const styles = {
            [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-300',
            [OrderStatus.PREPARING]: 'bg-orange-100 text-orange-800 border-orange-300',
            [OrderStatus.READY]: 'bg-purple-100 text-purple-800 border-purple-300',
            [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-300',
            [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-300',
        };
        const labels = {
            [OrderStatus.PENDING]: 'Pending',
            [OrderStatus.CONFIRMED]: 'Confirmed',
            [OrderStatus.PREPARING]: 'Preparing',
            [OrderStatus.READY]: 'Ready',
            [OrderStatus.COMPLETED]: 'Completed',
            [OrderStatus.CANCELLED]: 'Cancelled',
        };
        return { style: styles[status], label: labels[status] };
    };

    const getPaymentStatusBadge = (status: PaymentStatus) => {
        const styles = {
            [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [PaymentStatus.PAID]: 'bg-green-100 text-green-800 border-green-300',
            [PaymentStatus.FAILED]: 'bg-red-100 text-red-800 border-red-300',
        };
        const labels = {
            [PaymentStatus.PENDING]: 'Pending',
            [PaymentStatus.PAID]: 'Paid',
            [PaymentStatus.FAILED]: 'Failed',
        };
        return { style: styles[status], label: labels[status] };
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
                    Orders will appear here once customers place them
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
                                Order Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Total Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Payment Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => {
                            const orderType = getOrderTypeBadge(order.order_type);
                            const status = getStatusBadge(order.status);
                            const paymentStatus = getPaymentStatusBadge(order.payment_status);

                            return (
                                <tr key={order.id} className="transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-mono text-sm font-semibold text-text-primary">
                                            #{order.id.slice(0, 8)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${orderType.style}`}>
                                            {orderType.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${status.style}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-lg font-bold text-ruby-red">
                                            ₹{Number(order.total_amount).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${paymentStatus.style}`}>
                                            {paymentStatus.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-text-muted">
                                            {formatDate(order.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => onViewDetails(order)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
