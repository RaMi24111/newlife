"use client";

import React, { useState, useEffect } from 'react';
import { X, Package, CreditCard, User, MapPin, FileText, Clock } from 'lucide-react';
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

    const getOrderTypeLabel = (type: OrderType) => {
        const labels = {
            [OrderType.DINE_IN]: 'Dine-In',
            [OrderType.TAKEAWAY]: 'Takeaway',
            [OrderType.DELIVERY]: 'Delivery',
        };
        return labels[type] || type;
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
                    <div className="flex items-center gap-4">
                        <div className="bg-ruby-red/10 p-3 rounded-full">
                            <Package className="text-ruby-red" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-text-primary">
                                Order Details
                            </h2>
                            {orderDetails && (
                                <p className="text-text-muted text-sm">
                                    Order #{orderDetails.id.slice(0, 8).toUpperCase()}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isLoading && (
                        <div className="text-center py-12">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                            {error}
                        </div>
                    )}

                    {orderDetails && !isLoading && (
                        <div className="space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-text-muted text-sm mb-1">Order Type</div>
                                    <div className="font-semibold text-text-primary">
                                        {getOrderTypeLabel(orderDetails.order_type)}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-text-muted text-sm mb-1">Status</div>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                            orderDetails.status
                                        )}`}
                                    >
                                        {getStatusLabel(orderDetails.status)}
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-text-muted text-sm mb-1">Payment Status</div>
                                    <div className="font-semibold text-text-primary capitalize">
                                        {orderDetails.payment_status.toLowerCase()}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-text-muted text-sm mb-1">Created</div>
                                    <div className="text-sm text-text-primary">
                                        {formatDate(orderDetails.created_at)}
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            {(orderDetails.customer_name || orderDetails.table_number) && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                                        <User size={18} />
                                        Customer Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {orderDetails.customer_name && (
                                            <div>
                                                <div className="text-text-muted text-sm">Name</div>
                                                <div className="font-semibold">{orderDetails.customer_name}</div>
                                            </div>
                                        )}
                                        {orderDetails.table_number && (
                                            <div>
                                                <div className="text-text-muted text-sm">Table Number</div>
                                                <div className="font-semibold">{orderDetails.table_number}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                                    <Package size={18} />
                                    Order Items
                                </h3>
                                <div className="bg-gray-50 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-100 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary uppercase">
                                                    Item
                                                </th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-primary uppercase">
                                                    Qty
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-text-primary uppercase">
                                                    Price
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-text-primary uppercase">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {orderDetails.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3 text-text-primary">{item.name}</td>
                                                    <td className="px-4 py-3 text-center text-text-primary">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-text-primary">
                                                        ${Number(item.price).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-semibold text-text-primary">
                                                        ${Number(item.subtotal).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pricing Breakdown */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-text-primary">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">${Number(orderDetails.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-text-primary">
                                    <span>Tax:</span>
                                    <span className="font-semibold">${Number(orderDetails.tax).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold text-ruby-red">
                                    <span>Total:</span>
                                    <span>${Number(orderDetails.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            {orderDetails.payment_method && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                                        <CreditCard size={18} />
                                        Payment Method
                                    </h3>
                                    <div className="text-text-primary capitalize">{orderDetails.payment_method}</div>
                                </div>
                            )}

                            {/* Notes */}
                            {orderDetails.notes && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                                        <FileText size={18} />
                                        Notes
                                    </h3>
                                    <div className="text-text-primary">{orderDetails.notes}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gray-200 text-text-primary rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
