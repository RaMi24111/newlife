'use client';

import "../globals.css"
// import { usePathname } from 'next/navigation';

import { AuthProvider } from "./contexts/AuthContext"
import { OrdersProvider } from "./contexts/OrdersContext"
import { NavigationProvider } from "./contexts/NavigationContext"


import { StaffNavigation } from "./components/StaffNavigation"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const pathname = usePathname();

  return (
    <div className="min-h-screen bg-linear-to-br from-ivory via-white to-ivory">
      <AuthProvider>
        <OrdersProvider>
          <NavigationProvider>
            <StaffNavigation />
            <main className="lg:pl-64 pb-20 lg:pb-0 min-h-screen">
                {children}
            </main>
          </NavigationProvider>
        </OrdersProvider>
      </AuthProvider>
    </div>
  )
}


