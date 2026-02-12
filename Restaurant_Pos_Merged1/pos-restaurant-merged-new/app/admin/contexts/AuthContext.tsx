"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../lib/auth.service';

interface User {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount and validate with backend
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = authService.getToken();

                if (!token) {
                    setIsLoading(false);
                    return;
                }

                // Validate session with backend API (with timeout)
                const userData = await authService.validateSession();

                if (userData) {
                    setUser(userData);
                } else {
                    // Session invalid, clear everything
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth validation error:', error);
                // On error, clear user but keep token (user can try to navigate)
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await authService.login({ email, password });

            // Validate session and get fresh user data from API
            const userData = await authService.validateSession();
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
