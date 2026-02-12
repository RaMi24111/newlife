/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

export const API_CONFIG = {
    BASE_URL: 'https://superconservatively-drouthiest-karoline.ngrok-free.dev',
    ENDPOINTS: {
        ADMIN: {
            LOGIN: '/api/admin/login',
            LOGOUT: '/api/admin/logout',
            PROFILE: '/api/admin/profile',
            ME: '/api/admin/me',
            RESTAURANT: '/api/admin/restaurant',
        },
        MENU: {
            CATEGORIES: '/api/admin/menu/categories',
            ITEMS: '/api/admin/menu/items',
            ITEM_BY_ID: (id: string) => `/api/admin/menu/items/${id}`,
            TOGGLE_ITEM: (id: string) => `/api/admin/menu/items/${id}/toggle`,
        },
        STAFF: {
            LIST: '/api/admin/staff',
            CREATE: '/api/admin/staff',
            UPDATE: (id: string) => `/api/admin/staff/${id}`,
            TOGGLE: (id: string) => `/api/admin/staff/${id}/toggle`,
            DELETE: (id: string) => `/api/admin/staff/${id}`,
        },
        ORDERS: {
            LIST: '/api/admin/orders',
            DETAILS: (id: string) => `/api/admin/orders/${id}`,
        },
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
} as const;

export const TOKEN_KEY = 'admin_auth_token';
export const USER_KEY = 'admin_user_data';
