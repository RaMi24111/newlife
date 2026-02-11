'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';
import { Gradient } from '../components/Gradient';
import { Animated } from '../components/Animated';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrdersContext';
import { useNavigationState } from '../contexts/NavigationContext';

export default function NewOrder() {
  const { role } = useAuth();
  const { orders, setOrderStatus } = useOrders();
  const router = useRouter();
  const { setNavState } = useNavigationState();

  useEffect(() => {
    if (role === 'cashier') {
      router.push('/staff/billing-payment');
    }
  }, [role, router]);

  const newOrders = orders.filter((o) => o.status === 'new');
  const acceptedCount = orders.filter((o) => o.status !== 'new').length;

  const acceptOrder = (itemId: string, table: string) => {
    setOrderStatus(itemId, 'pending');
    setNavState({ table });
    router.push('/staff/order-details');
  };

  const handleDetailsClick = (table: string) => {
    setNavState({ table });
    router.push('/staff/order-details');
  };

  const OrderCard = ({ item, index }: { item: (typeof orders)[number]; index: number }) => {
    const isNew = item.status === 'new';

    return (
      <Animated type="fadeInUp" delay={index * 0.1} duration={0.5}>
        <div
          className={`rounded-3xl mb-5 overflow-hidden transition-all duration-200 group hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${isNew 
            ? 'bg-white shadow-glow border border-transparent' 
            : 'admin-card admin-card-hover'
          }`}
        >
          {/* Status Header */}
          {isNew ? (
            <Gradient
              colors={['#7B1F1F', '#9B2B2B']}
              className="px-5 py-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse" />
                  <div>
                    <p className="text-white font-black text-xl tracking-wide">NEW ORDER</p>
                    <p className="text-white/70 text-sm mt-0.5">{item.time}</p>
                  </div>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-xl">
                  <p className="text-white font-bold">{item.orderNumber}</p>
                </div>
              </div>
            </Gradient>
          ) : (
            <div className="px-5 py-4 bg-emerald-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                  <Icon name="checkmark" size={20} color="white" />
                </div>
                <div>
                  <p className="text-emerald-700 font-black text-lg">ACCEPTED</p>
                  <p className="text-emerald-600/70 text-sm">{item.orderNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* Card Content */}
          <button
            className="w-full p-5 text-left"
            onClick={() => !isNew && handleDetailsClick(item.table)}
          >
            {/* Table & Amount */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-ivory rounded-2xl flex items-center justify-center mr-4 shadow-soft">
                  <Icon name="restaurant" size={32} color="#8B1D1D" />
                </div>
                <div>
                  <p className="text-text font-black text-2xl">{item.table}</p>
                  <p className="text-text/60 text-sm mt-1">{item.items} items</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-text font-black text-3xl">₹{item.total.toFixed(0)}</p>
              </div>
            </div>

            {/* Customer */}
            {item.customerName && (
              <div className="flex items-center mb-4 bg-ivory rounded-2xl p-4 shadow-soft">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <Icon name="person" size={20} color="#7B1F1F" />
                </div>
                <div>
                  <p className="text-text/50 text-xs">CUSTOMER</p>
                  <p className="text-text font-semibold text-base">{item.customerName}</p>
                </div>
              </div>
            )}

            {/* Items Preview */}
            <div className="bg-ivory rounded-2xl p-4 shadow-soft">
              <p className="text-text/50 text-xs font-bold mb-3 tracking-wide">ORDER ITEMS</p>
              <div className="space-y-2">
                {item.itemsPreview.slice(0, 3).map((preview, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <p className="text-text/80 text-base">{preview}</p>
                  </div>
                ))}
                {item.itemsPreview.length > 3 && (
                  <p className="text-text/60 text-sm ml-5">
                    +{item.itemsPreview.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Accept Button */}
          {isNew && (
            <div className="px-5 pb-5">
              <button
                className="w-full rounded-2xl overflow-hidden shadow-glow-gold hover:scale-[0.98] transition-transform"
                onClick={() => acceptOrder(item.id, item.table)}
              >
                <Gradient
                  colors={['#C8A951', '#B8993D']}
                  className="py-5 flex items-center justify-center"
                >
                  <Icon name="checkmark-circle" size={24} color="white" />
                  <span className="text-white font-black text-lg ml-3 tracking-wide">ACCEPT ORDER</span>
                </Gradient>
              </button>
            </div>
          )}

          {/* View Details for Accepted */}
          {!isNew && (
            <div className="px-5 pb-5">
              <div
                className="w-full bg-surface-100 hover:bg-surface-200 rounded-2xl overflow-hidden transition-colors group"
                onClick={() => handleDetailsClick(item.table)}
              >
                <button className="w-full py-4 flex items-center justify-center">
                  <span className="text-text font-bold text-base mr-2">
                    View Details
                  </span>
                  <Icon
                    name="arrow-forward"
                    size={18}
                    color="currentColor"
                    className="text-text/60"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
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
                  New Orders
                </h1>
                <p className="text-gold text-xs md:text-sm font-medium tracking-[0.2em] uppercase opacity-90">
                  Incoming Kitchen Requests
                </p>
            </div>
            <div className="flex gap-4">

                   <button
                    className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10"
                    onClick={() => window.location.reload()}
                  >
                    <Icon name="refresh-outline" size={20} color="#FFFFFF" />
                  </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-20">
           <div className="flex flex-col lg:flex-row gap-8">
            {/* Stats Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
               <div className="bg-white rounded-3xl p-6 shadow-card border border-ivory-200 flex flex-row lg:flex-col gap-4 sticky top-8">
                    <div className="flex-1 bg-primary/5 rounded-2xl p-6 flex flex-col items-center justify-center border border-primary/10 group hover:border-primary transition-colors">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 transition-colors">
                            <Icon name="notifications" size={24} color="currentColor" className="text-primary group-hover:text-white" />
                        </div>
                        <span className="text-text/60 text-xs font-bold uppercase tracking-wider group-hover:text-primary transition-colors">New Requests</span>
                        <span className="text-4xl font-black text-text mt-1">{newOrders.length}</span>
                    </div>
                    <div className="flex-1 bg-gold/5 rounded-2xl p-6 flex flex-col items-center justify-center border border-gold/20">
                         <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-3">
                            <Icon name="checkmark-circle" size={24} color="#C8A951" />
                        </div>
                        <span className="text-text/60 text-xs font-bold uppercase tracking-wider">Accepted</span>
                        <span className="text-4xl font-black text-text mt-1">{acceptedCount}</span>
                    </div>
               </div>
            </div>

            {/* Orders Feed */}
            <div className="flex-1">
               {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((item, index) => (
                      <OrderCard key={item.id} item={item} index={index} />
                    ))}
                  </div>
               ) : (
                  <Animated type="fadeIn" duration={0.4} className="flex flex-col items-center justify-center py-20 bg-white/60 rounded-3xl border-2 border-dashed border-ivory-200">
                   <div className="w-24 h-24 bg-ivory rounded-full flex items-center justify-center mb-4">
                       <Icon name="receipt-outline" size={48} color="#94a3b8" />
                    </div>
                    <p className="text-text text-xl font-bold">No orders yet</p>
                    <p className="text-text/60 text-base mt-2">New customer orders will appear here</p>
                  </Animated>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
