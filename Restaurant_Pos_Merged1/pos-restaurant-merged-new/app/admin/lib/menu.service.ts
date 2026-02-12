/**
 * Menu Service
 * Handles menu categories and items management
 */

import { apiService } from './api.service';
import { API_CONFIG } from './api.config';

// Category Interface
export interface Category {
    id: string;
    name: string;
    description?: string;
    display_order?: number;
    created_at?: string;
    updated_at?: string;
}

// Menu Item Interface
export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    category_id: string;
    is_available: boolean;
    image_url?: string;
    preparation_time?: number;
    created_at?: string;
    updated_at?: string;
}

// Request/Response Types
export interface CreateCategoryRequest {
    name: string;
    description?: string;
    display_order?: number;
}

export interface CreateMenuItemRequest {
    name: string;
    description?: string;
    price: number;
    category_id: string;
    is_available?: boolean;
    image_url?: string;
    preparation_time?: number;
}

export interface UpdateMenuItemRequest {
    name?: string;
    description?: string;
    price?: number;
    category_id?: string;
    is_available?: boolean;
    image_url?: string;
    preparation_time?: number;
}

class MenuService {
    /**
     * Get all categories
     */
    async getCategories(): Promise<Category[]> {
        try {
            const categories = await apiService.get<Category[]>(
                API_CONFIG.ENDPOINTS.MENU.CATEGORIES,
                true
            );
            return categories;
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            throw error;
        }
    }

    /**
     * Create new category
     */
    async createCategory(data: CreateCategoryRequest): Promise<Category> {
        try {
            const category = await apiService.post<Category>(
                API_CONFIG.ENDPOINTS.MENU.CATEGORIES,
                data,
                true
            );
            return category;
        } catch (error) {
            console.error('Failed to create category:', error);
            throw error;
        }
    }

    /**
     * Get all menu items
     */
    async getMenuItems(): Promise<MenuItem[]> {
        try {
            const items = await apiService.get<MenuItem[]>(
                API_CONFIG.ENDPOINTS.MENU.ITEMS,
                true
            );
            return items;
        } catch (error) {
            console.error('Failed to fetch menu items:', error);
            throw error;
        }
    }

    /**
     * Create new menu item
     */
    async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
        try {
            const item = await apiService.post<MenuItem>(
                API_CONFIG.ENDPOINTS.MENU.ITEMS,
                data,
                true
            );
            return item;
        } catch (error) {
            console.error('Failed to create menu item:', error);
            throw error;
        }
    }

    /**
     * Update menu item
     */
    async updateMenuItem(id: string, data: UpdateMenuItemRequest): Promise<MenuItem> {
        try {
            const item = await apiService.put<MenuItem>(
                API_CONFIG.ENDPOINTS.MENU.ITEM_BY_ID(id),
                data,
                true
            );
            return item;
        } catch (error) {
            console.error('Failed to update menu item:', error);
            throw error;
        }
    }

    /**
     * Toggle menu item availability
     */
    async toggleItemAvailability(id: string): Promise<MenuItem> {
        try {
            const item = await apiService.patch<MenuItem>(
                API_CONFIG.ENDPOINTS.MENU.TOGGLE_ITEM(id),
                {},
                true
            );
            return item;
        } catch (error) {
            console.error('Failed to toggle item availability:', error);
            throw error;
        }
    }

    /**
     * Delete menu item
     */
    async deleteMenuItem(id: string): Promise<void> {
        try {
            await apiService.delete(
                API_CONFIG.ENDPOINTS.MENU.ITEM_BY_ID(id),
                true
            );
        } catch (error) {
            console.error('Failed to delete menu item:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const menuService = new MenuService();
