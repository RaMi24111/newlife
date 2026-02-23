/**
 * Orders Service
 * Handles read-only order viewing
 */

import { apiService } from './api.service';
import { API_CONFIG } from './api.config';

// Order Type Enum
export enum OrderType {
    DINE_IN = 'DINE_IN',
    TAKEAWAY = 'TAKEAWAY',
    DELIVERY = 'DELIVERY'
}

// Order Status Enum
export enum OrderStatus {
    PENDING = 'PENDING',
    PLACED = 'PLACED',
    CONFIRMED = 'CONFIRMED',
    PREPARING = 'PREPARING',
    READY = 'READY',
    COMPLETED = 'COMPLETED',
    SERVED = 'SERVED',
    CANCELLED = 'CANCELLED'
}

// Payment Status Enum
export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED'
}

// Order Item Interface
export interface OrderItem {
    id: string;
    menu_item_id?: string;
    name?: string;
    item_name?: string; // Backend uses item_name in details
    quantity: number;
    price: number | string;
    subtotal: number | string;
}

// Order Interface (List View)
export interface Order {
    id: string;
    order_type?: OrderType;
    status: OrderStatus;
    total_amount: number | string;
    payment_status: PaymentStatus;
    payment_method?: string | null;
    created_at: string;
    updated_at?: string;
    customer_name?: string | null;
    customer_phone?: string | null;
    table_number?: string | null;
    items?: OrderItem[];
}

// Order Details Interface (Detail View)
export interface OrderDetails extends Order {
    items: OrderItem[];
    subtotal: number | string;
    tax_amount: number | string;
    restaurant_id?: string;
    table_id?: string;
}

class OrdersService {
    /**
     * Get all orders
     */
    async getOrdersList(): Promise<Order[]> {
        try {
            const orders = await apiService.get<Order[]>(
                API_CONFIG.ENDPOINTS.ORDERS.LIST,
                true
            );
            return orders;
        } catch (error) {
            console.error('Failed to fetch orders list:', error);
            throw error;
        }
    }

    /**
     * Get order details by ID
     */
    async getOrderDetails(id: string): Promise<OrderDetails> {
        try {
            const order = await apiService.get<OrderDetails>(
                API_CONFIG.ENDPOINTS.ORDERS.DETAILS(id),
                true
            );
            return order;
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const ordersService = new OrdersService();
