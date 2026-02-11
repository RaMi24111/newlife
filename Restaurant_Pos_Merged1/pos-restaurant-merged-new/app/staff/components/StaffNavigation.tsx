'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';

export function StaffNavigation() {
  const pathname = usePathname();
  const { role } = useAuth();

  // Hide navigation on login page
  // if (pathname === '/staff/staff-login') return null;

  const isCashier = role === 'cashier';

  const navItems = isCashier
    ? [
        { name: 'Billing', href: '/staff/billing-payment', icon: 'wallet-outline' as const, activeIcon: 'wallet' as const },
        { name: 'Profile', href: '/staff/profile', icon: 'person-outline' as const, activeIcon: 'person' as const },
      ]
    : [
        { name: 'Home', href: '/staff/staff-dashboard', icon: 'home-outline' as const, activeIcon: 'home' as const },
        { name: 'Orders', href: '/staff/orders', icon: 'receipt-outline' as const, activeIcon: 'receipt' as const },
        { name: 'Tables', href: '/staff/tables', icon: 'grid-outline' as const, activeIcon: 'grid' as const },
        { name: 'Profile', href: '/staff/profile', icon: 'person-outline' as const, activeIcon: 'person' as const },
      ];

  return (
    <>
      {/* Desktop Sidebar (visible on lg screens) */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-ivory-300 flex-col z-50">
        <div className="p-6 border-b border-ivory-200">
           <h1 className="text-2xl font-serif text-primary font-bold tracking-tight">RestaurantOS</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.href} href={item.href} className="block">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-slate-600 hover:bg-ivory hover:text-primary'
                            }`}
                        >
                            <Icon 
                                name={isActive ? item.activeIcon : item.icon} 
                                size={24} 
                                color="currentColor" 
                            />
                            <span className={`font-bold ${isActive ? 'font-black' : 'font-medium'}`}>
                                {item.name}
                            </span>
                        </motion.div>
                    </Link>
                );
            })}
        </nav>

        <div className="p-6 border-t border-ivory-200">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                     {role ? role.charAt(0).toUpperCase() : 'S'}
                 </div>
                 <div>
                     <p className="text-sm font-bold text-slate-900 capitalize">{role}</p>
                     <p className="text-xs text-slate-500">Online</p>
                 </div>
             </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation (visible on smaller screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-ivory-300 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <nav className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                 <div className="flex flex-col items-center justify-center py-2 gap-1">
                    <motion.div
                       animate={isActive ? { y: -2 } : { y: 0 }}
                       className={`p-2 rounded-xl transition-colors ${
                           isActive ? 'bg-primary/10 text-primary' : 'text-slate-400'
                       }`}
                    >
                        <Icon 
                            name={isActive ? item.activeIcon : item.icon} 
                            size={24} 
                            color="currentColor" 
                        />
                    </motion.div>
                    <span className={`text-[10px] font-bold ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                        {item.name}
                    </span>
                 </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
