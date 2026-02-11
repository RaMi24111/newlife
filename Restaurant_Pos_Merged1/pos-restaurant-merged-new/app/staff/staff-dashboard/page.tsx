'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';

import { Animated } from '../components/Animated';
import { useAuth } from '../contexts/AuthContext';

interface OrderCard {
  id: string;
  table: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  items: number;
  time: string;
  amount: string;
}

export default function StaffDashboard() {
  const { role, isLoading } = useAuth();
  const router = useRouter();


  const isCashier = role === 'cashier';

  useEffect(() => {
    if (!isLoading && !role) {
      router.push('/admin/login/admin');
    }
  }, [role, isLoading, router]);

  useEffect(() => {
    if (isCashier) {
      router.push('/staff/billing-payment');
    }
  }, [isCashier, router]);

  const orders: OrderCard[] = [
    { id: '1', table: 'Table 5', status: 'pending', items: 3, time: '2 min ago', amount: '₹450' },
    { id: '2', table: 'Table 12', status: 'preparing', items: 5, time: '8 min ago', amount: '₹780' },
    { id: '3', table: 'Table 3', status: 'ready', items: 2, time: '1 min ago', amount: '₹320' },
    { id: '4', table: 'Table 8', status: 'pending', items: 4, time: '5 min ago', amount: '₹560' },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { label: 'PENDING', bg: '#FEF3C7', color: '#D97706', icon: 'time' as const },
      preparing: { label: 'PREPARING', bg: '#DBEAFE', color: '#2563EB', icon: 'flame' as const },
      ready: { label: 'READY', bg: '#D1FAE5', color: '#059669', icon: 'checkmark-circle' as const },
      served: { label: 'SERVED', bg: '#F1F5F9', color: '#64748B', icon: 'checkmark-done' as const },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  if (isLoading || isCashier) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col font-sans">
      {/* Header Section */}
      <div className="relative bg-primary py-10 md:py-16 shadow-2xl overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-6xl font-serif text-white mb-2 md:mb-4 tracking-tight drop-shadow-md">
              Staff Dashboard
            </h1>
            <p className="text-gold text-xs md:text-base font-medium tracking-[0.2em] uppercase opacity-90">
              Oversee Your Fine Dining Operations
            </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-20">
        
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
           {/* New Order */}
           <button 
              onClick={() => router.push('/staff/new-order')}
              className="group bg-white rounded-[32px] p-8 shadow-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center border border-slate-100"
           >
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="restaurant" size={40} color="#7B1F1F" />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 mb-3 group-hover:text-primary transition-colors">New Order</h3>
              
           </button>

           {/* Tables */}
           <button 
              onClick={() => router.push('/staff/tables')}
              className="group bg-white rounded-[32px] p-8 shadow-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center border border-slate-100"
           >
              <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="grid" size={40} color="#d97706" />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 mb-3 group-hover:text-primary transition-colors">Table Status</h3>
           </button>
           {/* Orders / Bill */}
           <button 
              onClick={() => router.push('/staff/orders')}
              className="group bg-white rounded-[32px] p-8 shadow-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center border border-slate-100"
           >
              <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="receipt" size={40} color="#0d9488" />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 mb-3 group-hover:text-primary transition-colors">Orders</h3>
           </button>

           {/* Profile / Staff */}
           <button 
              onClick={() => router.push('/staff/profile')}
              className="group bg-white rounded-[32px] p-8 shadow-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center border border-slate-100"
           >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="people" size={40} color="#475569" />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 mb-3 group-hover:text-primary transition-colors">My Profile</h3>
           </button>
        </div>

        {/* Active Orders Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-[24px] md:rounded-[40px] p-6 md:p-12 shadow-card border border-white/50">
           <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                  <h2 className="text-3xl font-serif text-slate-900 mb-2">Active Orders</h2>
                  <p className="text-slate-500">Real-time supervision of current dining service.</p>
              </div>
              <button 
                 onClick={() => router.push('/staff/orders')}
                 className="mt-4 md:mt-0 px-6 py-3 bg-primary text-white rounded-xl font-bold transition-colors flex items-center"
              >
                  <span>View All Orders</span>
                  <Icon name="arrow-forward" size={18} color="white" className="ml-2" />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((item, index) => {
                 const config = getStatusConfig(item.status);
                 return (
                  <Animated key={item.id} type="fadeInUp" delay={index * 0.1} duration={0.5} className="h-full">
                    <button
                      className="w-full h-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-5 text-left group flex flex-col justify-between"
                      onClick={() => router.push('/staff/order-details')}
                    >
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mr-3 transition-colors">
                                 <Icon name="restaurant" size={24} color="#8B1D1D" />
                             </div>
                             <div>
                                 <h4 className="font-bold text-lg text-slate-900">{item.table}</h4>
                                 <p className="text-slate-400 text-xs">OrderId: #{item.id}</p>
                             </div>
                         </div>
                         <div className={`px-3 py-1 rounded-full border ${config.bg === '#F1F5F9' ? 'border-slate-200' : 'border-transparent'}`} style={{ backgroundColor: config.bg }}>
                             <span className="text-xs font-bold tracking-wide" style={{ color: config.color }}>{config.label}</span>
                         </div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-slate-500 text-sm font-medium">{item.items} Items</p>
                              <p className="text-slate-400 text-xs mt-1 flex items-center">
                                  <Icon name="time" size={12} color="#94a3b8" className="mr-1" />
                                  {item.time}
                              </p>
                          </div>
                          <span className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{item.amount}</span>
                      </div>
                    </button>
                  </Animated>
                 );
              })}
           </div>
        </div>

      </div>
    </div>
  );
}
