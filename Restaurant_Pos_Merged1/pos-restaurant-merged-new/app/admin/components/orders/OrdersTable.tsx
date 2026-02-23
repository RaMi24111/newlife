"use client";

import React from 'react';
import { Eye, Package } from 'lucide-react';
import { Order, OrderType, OrderStatus, PaymentStatus } from '../../lib/orders.service';

interface OrdersTableProps {
    orders: Order[];
    onViewDetails: (order: Order) => void;
}

export default function OrdersTable({ orders, onViewDetails }: OrdersTableProps) {
    const getOrderTypeBadge = (type?: OrderType) => {
        if (!type) return { style: 'bg-gray-100 text-gray-800 border-gray-300', label: 'N/A' };
        const styles: Record<string, string> = {
            [OrderType.DINE_IN]: 'bg-blue-100 text-blue-800 border-blue-300',
            [OrderType.TAKEAWAY]: 'bg-purple-100 text-purple-800 border-purple-300',
            [OrderType.DELIVERY]: 'bg-green-100 text-green-800 border-green-300',
        };
        const labels: Record<string, string> = {
            [OrderType.DINE_IN]: 'Dine-In',
            [OrderType.TAKEAWAY]: 'Takeaway',
            [OrderType.DELIVERY]: 'Delivery',
        };
        return { style: styles[type] || 'bg-gray-100 text-gray-800 border-gray-300', label: labels[type] || type };
    };

    const getStatusBadge = (status: OrderStatus) => {
        const styles: Record<string, string> = {
            [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [OrderStatus.PLACED]: 'bg-sky-100 text-sky-800 border-sky-300',
            [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-300',
            [OrderStatus.PREPARING]: 'bg-orange-100 text-orange-800 border-orange-300',
            [OrderStatus.READY]: 'bg-purple-100 text-purple-800 border-purple-300',
            [OrderStatus.SERVED]: 'bg-teal-100 text-teal-800 border-teal-300',
            [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-300',
            [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-300',
        };
        const labels: Record<string, string> = {
            [OrderStatus.PENDING]: 'Pending',
            [OrderStatus.PLACED]: 'Placed',
            [OrderStatus.CONFIRMED]: 'Confirmed',
            [OrderStatus.PREPARING]: 'Preparing',
            [OrderStatus.READY]: 'Ready',
            [OrderStatus.SERVED]: 'Served',
            [OrderStatus.COMPLETED]: 'Completed',
            [OrderStatus.CANCELLED]: 'Cancelled',
        };
        return { style: styles[status] || 'bg-gray-100 text-gray-800 border-gray-300', label: labels[status] || status };
    };

    const getPaymentStatusBadge = (status: PaymentStatus) => {
        const styles: Record<string, string> = {
            [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [PaymentStatus.PAID]: 'bg-green-100 text-green-800 border-green-300',
            [PaymentStatus.FAILED]: 'bg-red-100 text-red-800 border-red-300',
        };
        const labels: Record<string, string> = {
            [PaymentStatus.PENDING]: 'Pending',
            [PaymentStatus.PAID]: 'Paid',
            [PaymentStatus.FAILED]: 'Failed',
        };
        return { style: styles[status] || 'bg-gray-100 text-gray-800 border-gray-300', label: labels[status] || status };
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
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
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Table</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Items</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => {
                            const orderType = getOrderTypeBadge(order.order_type);
                            const status = getStatusBadge(order.status);
                            const paymentStatus = getPaymentStatusBadge(order.payment_status);

                            return (
                                <tr key={order.id} className="transition-colors hover:bg-gray-50">
                                    {/* Order ID */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-mono text-sm font-semibold text-text-primary">
                                            #{order.id.slice(0, 8)}
                                        </div>
                                        {order.order_type && (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${orderType.style}`}>
                                                {orderType.label}
                                            </span>
                                        )}
                                    </td>

                                    {/* Customer */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-text-primary">
                                            {order.customer_name || '—'}
                                        </div>
                                        {order.customer_phone && (
                                            <div className="text-xs text-text-muted">{order.customer_phone}</div>
                                        )}
                                    </td>

                                    {/* Table */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-text-primary">
                                            {order.table_number ? `Table ${order.table_number}` : '—'}
                                        </div>
                                    </td>

                                    {/* Items */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-text-primary max-w-[180px]">
                                            {order.items && order.items.length > 0 ? (
                                                <ul className="space-y-0.5">
                                                    {order.items.map((item) => (
                                                        <li key={item.id} className="truncate">
                                                            {item.quantity}× {item.name || item.item_name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : '—'}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${status.style}`}>
                                            {status.label}
                                        </span>
                                    </td>

                                    {/* Total */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-lg font-bold text-ruby-red">
                                            ₹{Number(order.total_amount).toFixed(2)}
                                        </div>
                                    </td>

                                    {/* Payment */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${paymentStatus.style}`}>
                                            {paymentStatus.label}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-text-muted">
                                            {formatDate(order.created_at)}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => onViewDetails(order)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-colors text-sm font-semibold"
                                        >
                                            <Eye size={16} />
                                            Details
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
