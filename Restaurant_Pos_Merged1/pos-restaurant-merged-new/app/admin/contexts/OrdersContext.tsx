"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ordersService, Order, OrderDetails } from '../lib/orders.service';

interface OrdersContextType {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    refetchOrders: () => Promise<void>;
    getOrderDetails: (id: string) => Promise<OrderDetails>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const data = await ordersService.getOrdersList();
            setOrders(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to load orders');
        }
    };

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await fetchOrders();
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const getOrderDetails = async (id: string): Promise<OrderDetails> => {
        return await ordersService.getOrderDetails(id);
    };

    const value: OrdersContextType = {
        orders,
        isLoading,
        error,
        refetchOrders: fetchOrders,
        getOrderDetails,
    };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
    const context = useContext(OrdersContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrdersProvider');
    }
    return context;
}
