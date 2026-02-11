'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type StaffRole = 'server' | 'cashier';


interface AuthContextType {
  role: StaffRole | null;
  isLoading: boolean;
  setRole: (role: StaffRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<StaffRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const storedRole = localStorage.getItem('extra_staff_role');
    if (storedRole) {
      setRoleState(storedRole as StaffRole);
    }
    setIsLoading(false);
  }, []);

  const setRole = (newRole: StaffRole) => {
    localStorage.setItem('extra_staff_role', newRole);
    setRoleState(newRole);
  };

  const logout = () => {
    localStorage.removeItem('extra_staff_role');
    setRoleState(null);
  };

  return (
    <AuthContext.Provider value={{ role, isLoading, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
