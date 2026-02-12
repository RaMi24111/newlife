"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { menuService, Category, MenuItem } from '../lib/menu.service';

interface MenuContextType {
    categories: Category[];
    menuItems: MenuItem[];
    isLoading: boolean;
    error: string | null;
    refetchCategories: () => Promise<void>;
    refetchMenuItems: () => Promise<void>;
    addCategory: (data: { name: string; description?: string }) => Promise<void>;
    addMenuItem: (data: any) => Promise<void>;
    updateMenuItem: (id: string, data: any) => Promise<void>;
    toggleItemAvailability: (id: string) => Promise<void>;
    deleteMenuItem: (id: string) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            const data = await menuService.getCategories();
            setCategories(data);
        } catch (err: any) {
            console.error('Error fetching categories:', err);
            setError(err.message || 'Failed to load categories');
        }
    };

    const fetchMenuItems = async () => {
        try {
            const data = await menuService.getMenuItems();
            setMenuItems(data);
        } catch (err: any) {
            console.error('Error fetching menu items:', err);
            setError(err.message || 'Failed to load menu items');
        }
    };

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            await Promise.all([fetchCategories(), fetchMenuItems()]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const addCategory = async (data: { name: string; description?: string }) => {
        await menuService.createCategory(data);
        await fetchCategories();
    };

    const addMenuItem = async (data: any) => {
        await menuService.createMenuItem(data);
        await fetchMenuItems();
    };

    const updateMenuItem = async (id: string, data: any) => {
        await menuService.updateMenuItem(id, data);
        await fetchMenuItems();
    };

    const toggleItemAvailability = async (id: string) => {
        // Optimistic update
        setMenuItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, is_available: !item.is_available } : item
            )
        );

        try {
            await menuService.toggleItemAvailability(id);
        } catch (err) {
            // Revert on error
            await fetchMenuItems();
            throw err;
        }
    };

    const deleteMenuItem = async (id: string) => {
        await menuService.deleteMenuItem(id);
        setMenuItems(prev => prev.filter(item => item.id !== id));
    };

    const value: MenuContextType = {
        categories,
        menuItems,
        isLoading,
        error,
        refetchCategories: fetchCategories,
        refetchMenuItems: fetchMenuItems,
        addCategory,
        addMenuItem,
        updateMenuItem,
        toggleItemAvailability,
        deleteMenuItem,
    };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
}
