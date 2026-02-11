'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';
import { Animated } from '../components/Animated';
import { useAuth } from '../contexts/AuthContext';
import { OrderStatus, useOrders } from '../contexts/OrdersContext';
import { useNavigationState } from '../contexts/NavigationContext';

type FilterId = 'all' | Extract<OrderStatus, 'pending' | 'preparing' | 'ready' | 'served'>;

export default function Orders() {
  const { role } = useAuth();
  const { orders } = useOrders();
  const router = useRouter();
  const { setNavState } = useNavigationState();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  // Cashier cannot access orders - redirect to billing
  useEffect(() => {
    if (role === 'cashier') {
      router.push('/staff/billing-payment');
    }
  }, [role, router]);

  // Only show orders that have been accepted into the main flow
  const allOrders = useMemo(
    () => orders.filter((order) => order.status !== 'new'),
    [orders],
  );

  const filters = [
    { id: 'all' as const, label: 'All', count: allOrders.length },
    { id: 'pending' as const, label: 'Pending', count: allOrders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
    { id: 'preparing' as const, label: 'Preparing', count: allOrders.filter(o => o.status === 'preparing').length, color: '#3b82f6' },
    { id: 'ready' as const, label: 'Ready', count: allOrders.filter(o => o.status === 'ready').length, color: '#C8A951' },
    { id: 'served' as const, label: 'Served', count: allOrders.filter(o => o.status === 'served').length, color: '#64748b' },
  ];

  const filteredOrders = activeFilter === 'all'
    ? allOrders
    : allOrders.filter(order => order.status === activeFilter);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'PENDING',
          bg: '#FEF3C7',
          color: '#D97706',
          icon: 'time' as const,
        };
      case 'preparing':
        return {
          label: 'PREPARING',
          bg: '#DBEAFE',
          color: '#2563EB',
          icon: 'flame' as const,
        };
      case 'ready':
        return {
          label: 'READY TO SERVE',
          bg: '#D1FAE5',
          color: '#059669',
          icon: 'checkmark-circle' as const,
        };
      case 'served':
        return {
          label: 'SERVED',
          bg: '#F1F5F9',
          color: '#64748B',
          icon: 'checkmark-done' as const,
        };
      default:
        return {
          label: 'UNKNOWN',
          bg: '#F1F5F9',
          color: '#64748B',
          icon: 'help-circle-outline' as const,
        };
    }
  };

  const handleOrderClick = (table: string) => {
    setNavState({ table });
    router.push('/staff/order-details');
  };

  const OrderCard = ({ item, index }: { item: typeof allOrders[number]; index: number }) => {
    const config = getStatusConfig(item.status);

    return (
      <Animated type="fadeInUp" delay={index * 0.06} duration={0.4} className="h-full">
        <button
          className="w-full h-full admin-card mb-0 overflow-hidden text-left group hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 flex flex-col"
          onClick={() => handleOrderClick(item.table)}
        >
          {/* Large Status Banner */}
          <div
            className="px-5 py-4 flex items-center justify-between transition-colors"
            style={{ backgroundColor: config.bg }}
          >
            <div className="flex items-center">
              <Icon name={config.icon} size={28} color={config.color} className="mr-3" />
              <div>
                <p
                  className="font-black text-lg tracking-wide"
                  style={{ color: config.color }}
                >
                  {config.label}
                </p>
                <p className="text-sm mt-0.5" style={{ color: config.color, opacity: 0.8 }}>
                  {item.time}
                </p>
              </div>
            </div>
            <Icon name="chevron-forward" size={24} color={config.color} />
          </div>

          {/* Card Content */}
          <div className="p-5 transition-colors flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center flex-1">
                <div className="admin-card-icon mr-4">
                  <Icon name="restaurant" size={32} color="#8B1D1D" className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="admin-card-title text-xl">{item.table}</p>
                  {item.customerName && (
                    <div className="flex items-center mt-1">
                      <Icon name="person" size={14} color="#64748b" className="text-text/70" />
                      <span className="admin-card-subtitle ml-1">{item.customerName}</span>
                    </div>
                  )}
                  <p className="admin-card-subtitle mt-1">{item.items} items</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-text font-black text-2xl transition-colors">₹{item.total.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </button>
      </Animated>
    );
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col font-sans">
      {/* Header Section */}
      <div className="relative bg-primary py-10 md:py-16 shadow-2xl overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-serif text-white mb-2 tracking-tight drop-shadow-md">
                  Active Orders
                </h1>
                <p className="text-gold text-xs md:text-sm font-medium tracking-[0.2em] uppercase opacity-90">
                  Manage Real-time Dining Service
                </p>
            </div>
            <div className="flex gap-4">

                   <button
                    className="bg-gold hover:bg-yellow-500 text-white px-5 py-2 md:px-6 md:py-3 rounded-xl font-bold transition-colors flex items-center shadow-lg transform hover:-translate-y-0.5 text-sm md:text-base"
                    onClick={() => router.push('/staff/new-order')}
                  >
                    <Icon name="add" size={20} color="#FFFFFF" className="mr-2" />
                    New Order
                  </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar (Desktop) / Topbar (Mobile) */}
            <div className="w-full md:w-64 shrink-0">
               <div className="bg-white rounded-3xl p-6 shadow-card border border-ivory-200 sticky top-8">
                   <h3 className="text-text/60 text-xs font-bold uppercase tracking-wider mb-4">Filter Status</h3>
                   <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                      {filters.map((item) => (
                        <button
                          key={item.id}
                          className={`shrink-0 w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${
                            activeFilter === item.id
                              ? 'bg-primary text-white shadow-lg'
                              : 'hover:bg-ivory text-text/70'
                          }`}
                          onClick={() => setActiveFilter(item.id)}
                        >
                          <span className={`font-bold ${activeFilter === item.id ? 'text-white' : 'text-text'}`}>{item.label}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            activeFilter === item.id
                              ? 'bg-white/20 text-white'
                              : 'bg-ivory text-text/60'
                          }`}>
                             {item.count}
                          </span>
                        </button>
                      ))}
                   </div>
               </div>
            </div>

            {/* Orders Grid */}
            <div className="flex-1">
               {filteredOrders.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOrders.map((item, index) => (
                      <OrderCard key={item.id} item={item} index={index} />
                    ))}
                  </div>
                ) : (
                  <Animated type="fadeIn" duration={0.4} className="flex flex-col items-center justify-center py-20 bg-white/60 rounded-3xl border-2 border-dashed border-ivory-200">
                    <div className="w-24 h-24 bg-ivory rounded-full flex items-center justify-center mb-4">
                      <Icon name="receipt" size={48} color="#94a3b8" />
                    </div>
                    <p className="text-text text-xl font-bold">No orders found</p>
                    <p className="text-text/60 text-base mt-2">Try a different filter</p>
                  </Animated>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
