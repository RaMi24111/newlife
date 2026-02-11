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
    },
    HEADERS: {
        'Content-Type': 'application/json',
    },
} as const;

export const TOKEN_KEY = 'admin_auth_token';
export const USER_KEY = 'admin_user_data';
