'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type NavState = Record<string, any>;

interface NavigationContextType {
  navState: NavState;
  setNavState: (state: NavState) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [navState, setNavState] = useState<NavState>({});

  return (
    <NavigationContext.Provider value={{ navState, setNavState }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationState() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationState must be used within a NavigationProvider');
  }
  return context;
}
