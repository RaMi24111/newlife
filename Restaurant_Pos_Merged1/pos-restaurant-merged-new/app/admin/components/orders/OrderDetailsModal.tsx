"use client";

import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CreditCard } from 'lucide-react';
import { OrderDetails, OrderStatus, PaymentStatus, OrderType } from '../../lib/orders.service';
import { useOrders } from '../../contexts/OrdersContext';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string | null;
}

export default function OrderDetailsModal({ isOpen, onClose, orderId }: OrderDetailsModalProps) {
    const { getOrderDetails } = useOrders();
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, orderId]);

    const fetchOrderDetails = async () => {
        if (!orderId) return;

        setIsLoading(true);
        setError(null);
        try {
            const details = await getOrderDetails(orderId);
            setOrderDetails(details);
        } catch (err: any) {
            setError(err.message || 'Failed to load order details');
        } finally {
            setIsLoading(false);
        }
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
        return styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getPaymentStatusBadge = (status: PaymentStatus) => {
        const styles = {
            [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            [PaymentStatus.PAID]: 'bg-green-100 text-green-800 border-green-300',
            [PaymentStatus.FAILED]: 'bg-red-100 text-red-800 border-red-300',
        };
        return styles[status] || styles[PaymentStatus.PENDING];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-serif font-bold text-text-primary">
                        Order Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <p className="text-red-800">{error}</p>
                        </div>
                    ) : orderDetails ? (
                        <div className="space-y-6">
                            {/* Order Header */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Order ID</div>
                                        <div className="font-mono font-semibold text-text-primary">
                                            #{orderDetails.id.slice(0, 8)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Order Type</div>
                                        <div className="font-semibold text-text-primary">
                                            {orderDetails.order_type ? orderDetails.order_type.replace('_', ' ') : 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Table</div>
                                        <div className="font-semibold text-text-primary">
                                            {orderDetails.table_number ? `Table ${orderDetails.table_number}` : '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Status</div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(orderDetails.status)}`}>
                                            {orderDetails.status}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Customer</div>
                                        <div className="font-semibold text-text-primary">
                                            {orderDetails.customer_name || '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Phone</div>
                                        <div className="font-semibold text-text-primary">
                                            {orderDetails.customer_phone || '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Payment</div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusBadge(orderDetails.payment_status)}`}>
                                            {orderDetails.payment_status}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-text-muted mb-1">Date</div>
                                        <div className="text-sm font-semibold text-text-primary">
                                            {new Date(orderDetails.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                    <Package size={20} />
                                    Order Items
                                </h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">Item</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">Quantity</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Price</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {orderDetails.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3 text-text-primary">{item.name || item.item_name}</td>
                                                    <td className="px-4 py-3 text-center text-text-primary">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right text-text-primary">
                                                        ₹{Number(item.price).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-semibold text-text-primary">
                                                        ₹{Number(item.subtotal).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h3 className="text-lg font-semibold text-text-primary mb-4">Price Breakdown</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-text-primary">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">₹{Number(orderDetails.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-primary">
                                        <span>Tax</span>
                                        <span className="font-semibold">₹{Number(orderDetails.tax_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-300 pt-2 mt-2">
                                        <div className="flex justify-between text-lg font-bold text-ruby-red">
                                            <span>Total</span>
                                            <span>₹{Number(orderDetails.total_amount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Timestamps */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                        <CreditCard size={16} />
                                        Payment Information
                                    </h4>
                                    <div className="space-y-1">
                                        <div className="text-sm text-blue-800">
                                            <span className="font-semibold">Method:</span> {orderDetails.payment_method || 'N/A'}
                                        </div>
                                        <div className="text-sm text-blue-800">
                                            <span className="font-semibold">Status:</span> {orderDetails.payment_status}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                        <Clock size={16} />
                                        Timestamps
                                    </h4>
                                    <div className="space-y-1">
                                        <div className="text-sm text-purple-800">
                                            <span className="font-semibold">Created:</span> {formatDate(orderDetails.created_at)}
                                        </div>
                                        {orderDetails.updated_at && (
                                            <div className="text-sm text-purple-800">
                                                <span className="font-semibold">Updated:</span> {formatDate(orderDetails.updated_at)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
