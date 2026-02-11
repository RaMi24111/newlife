'use client';
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type OrderStatus = 'new' | 'pending' | 'preparing' | 'ready' | 'served';

export interface Order {
  id: string;
  orderNumber: string;
  table: string;
  customerName?: string;
  items: number;
  total: number;
  status: OrderStatus;
  time: string;
  itemsPreview: string[];
}

interface OrdersContextType {
  orders: Order[];
  setOrderStatus: (id: string, status: OrderStatus) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const initialOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#12346',
    table: 'Table 7',
    customerName: 'John Smith',
    items: 4,
    total: 567.95,
    status: 'new',
    time: 'Just now',
    itemsPreview: ['Grilled Salmon', 'Caesar Salad', 'Iced Tea x2'],
  },
  {
    id: '2',
    orderNumber: '#12347',
    table: 'Table 9',
    customerName: 'Sarah Johnson',
    items: 2,
    total: 343.98,
    status: 'new',
    time: '1 min ago',
    itemsPreview: ['Pasta Carbonara', 'Caesar Salad'],
  },
  {
    id: '3',
    orderNumber: '#12348',
    table: 'Table 2',
    customerName: 'Mike Davis',
    items: 3,
    total: 452.97,
    status: 'pending',
    time: '5 min ago',
    itemsPreview: ['Grilled Salmon', 'Iced Tea', 'Tiramisu'],
  },
  {
    id: '4',
    orderNumber: '#12349',
    table: 'Table 11',
    items: 5,
    total: 789.95,
    status: 'preparing',
    time: '8 min ago',
    itemsPreview: ['Pasta Carbonara', 'Caesar Salad', 'Grilled Salmon', 'Iced Tea x2'],
  },
];

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const setOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  };

  const value = useMemo(
    () => ({
      orders,
      setOrderStatus,
    }),
    [orders],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
