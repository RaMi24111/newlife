'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';

import { Animated } from '../components/Animated';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationState } from '../contexts/NavigationContext';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

type PaymentMethod = 'cash' | 'upi';

export default function OrderDetails() {
  const { role } = useAuth();
  const router = useRouter();
  const { navState, setNavState } = useNavigationState();

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: '1', name: 'Grilled Salmon', quantity: 2, price: 24.99, notes: 'No lemon', status: 'preparing' },
    { id: '2', name: 'Caesar Salad', quantity: 1, price: 12.99, status: 'ready' },
    { id: '3', name: 'Pasta Carbonara', quantity: 1, price: 18.99, notes: 'Extra cheese', status: 'preparing' },
    { id: '4', name: 'Iced Tea', quantity: 3, price: 3.99, status: 'served' },
  ]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [tipAmount, setTipAmount] = useState('');

  const table = (navState?.table as string) || 'Table 5';

  const statusOrder = ['pending', 'preparing', 'ready', 'served'] as const;

  const getNextStatus = (current: OrderItem['status']): OrderItem['status'] => {
    if (current === 'served') return 'served';
    const idx = statusOrder.indexOf(current);
    return statusOrder[Math.min(idx + 1, statusOrder.length - 1)];
  };

  const updateItemStatus = (id: string) => {
    setOrderItems((prev) => prev.map((it) =>
      it.id === id ? { ...it, status: getNextStatus(it.status) } : it
    ));
  };

  const markAllReady = () => {
    setOrderItems((prev) => prev.map((it) => ({ ...it, status: 'ready' })));
  };

  const markAllServed = () => {
    setOrderItems((prev) => prev.map((it) => ({ ...it, status: 'served' })));
  };

  const orderInfo = {
    orderNumber: '#12345',
    table,
    server: 'John Doe',
    time: '15 min ago',
    subtotal: 89.93,
    tax: 7.19,
    total: 97.12,
  };

  const paymentMethods = [
    { id: 'cash' as PaymentMethod, label: 'Cash', icon: 'cash-outline' as const, color: '#C8A951' },
    { id: 'upi' as PaymentMethod, label: 'UPI', icon: 'phone-portrait-outline' as const, color: '#7B1F1F' },
  ];

  const tipPresets = [0, 10, 15, 20];
  const tip = parseFloat(tipAmount) || 0;
  const finalTotal = orderInfo.total + tip;

  const handleProceedToPayment = () => {
    setSelectedPaymentMethod(null);
    setTipAmount('');
    setShowPaymentModal(true);
  };

  const calculateTipFromPercent = (percent: number) => ((orderInfo.total * percent) / 100).toFixed(0);

  const handleConfirmPayment = () => {
    if (!selectedPaymentMethod) return;
    setShowPaymentModal(false);
    
    setNavState({
      orderNumber: orderInfo.orderNumber,
      table: orderInfo.table,
      orderTotal: orderInfo.total.toFixed(2),
      tipAmount: tip.toFixed(2),
      finalTotal: finalTotal.toFixed(2),
      paymentMethod: selectedPaymentMethod,
    });
    
    router.push('/staff/bill');
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { bg: 'bg-warning-light', iconColor: '#f59e0b', gradient: ['#f59e0b', '#d97706'] as [string, string], icon: 'time' as const },
      preparing: { bg: 'bg-info-light', iconColor: '#3b82f6', gradient: ['#3b82f6', '#2563eb'] as [string, string], icon: 'flame' as const },
      ready: { bg: 'bg-success-light', iconColor: '#C8A951', gradient: ['#C8A951', '#B8993D'] as [string, string], icon: 'checkmark-circle' as const },
      served: { bg: 'bg-slate-100', iconColor: '#64748b', gradient: ['#94a3b8', '#64748b'] as [string, string], icon: 'checkmark-done' as const },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col font-sans">
       {/* Background Patterns */}
       <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Header */}
      <div className="relative bg-primary py-8 md:py-14 shadow-2xl overflow-hidden z-20">
        <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">

                <div className="flex-1">
                     <h1 className="text-2xl md:text-4xl font-serif text-white mb-1 tracking-tight drop-shadow-md flex items-center flex-wrap">
                      Order Details <span className="opacity-60 text-lg md:text-2xl ml-2 font-sans font-normal whitespace-nowrap">{orderInfo.orderNumber}</span>
                    </h1>
                     <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/80 text-xs md:text-sm font-medium">
                        <span className="flex items-center gap-1"><Icon name="restaurant" size={14} color="currentColor"/> {orderInfo.table}</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                        <span className="flex items-center gap-1"><Icon name="person" size={14} color="currentColor"/> {orderInfo.server}</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                        <span className="flex items-center gap-1"><Icon name="time" size={14} color="currentColor"/> {orderInfo.time}</span>
                     </div>
                </div>
             </div>
             <button className="hidden md:flex w-12 h-12 bg-white/10 rounded-xl items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10">
                <Icon name="print-outline" size={24} color="#FFFFFF" />
             </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
                 {/* Actions Bar */}
                 <div className="flex flex-wrap gap-4">
                     <button
                        className="flex-1 bg-white hover:bg-blue-50 border border-blue-200 shadow-sm hover:shadow-md rounded-2xl py-4 flex items-center justify-center transition-all group"
                        onClick={markAllReady}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                             <Icon name="checkmark-circle" size={20} color="#2563eb" />
                        </div>
                        <div className="text-left">
                            <p className="text-blue-900 font-bold text-sm">Mark All Ready</p>
                            <p className="text-blue-500 text-xs">Notify servers</p>
                        </div>
                      </button>
                      <button
                        className="flex-1 bg-white hover:bg-emerald-50 border border-emerald-200 shadow-sm hover:shadow-md rounded-2xl py-4 flex items-center justify-center transition-all group"
                        onClick={markAllServed}
                      >
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                             <Icon name="checkmark-done" size={20} color="#059669" />
                        </div>
                         <div className="text-left">
                            <p className="text-emerald-900 font-bold text-sm">Mark All Served</p>
                            <p className="text-emerald-500 text-xs">Complete order</p>
                        </div>
                      </button>
                 </div>

                 <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-card border border-slate-100 overflow-hidden min-h-[400px] md:min-h-[500px]">
                    <div className="px-5 md:px-8 py-4 md:py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">Order Items ({orderItems.length})</h2>
                       {role !== 'server' && (
                           <button className="text-primary font-bold text-xs md:text-sm flex items-center px-2 md:px-3 py-2 rounded-lg transition-colors">
                                <Icon name="add-circle" size={18} color="#7B1F1F" className="mr-1 md:mr-2"/>
                                Add Items
                            </button>
                       )}
                    </div>
                    <div className="p-4 md:p-6 grid grid-cols-1 gap-3 md:gap-4">
                        {orderItems.map((item, index) => (
                             <Animated key={item.id} type="fadeInUp" delay={index * 0.05} duration={0.3}>
                                 <div className="bg-white border border-ivory-200 rounded-2xl p-4 hover:shadow-card transition-all group flex items-start sm:items-center gap-4">
                                     {/* Item Status Indicator */}
                                     {(() => {
                                        const config = getStatusConfig(item.status);
                                        return (
                                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${config.bg}`}>
                                                <Icon name={config.icon} size={24} color={config.iconColor} />
                                            </div>
                                        );
                                     })()}
                                     
                                     <div className="flex-1">
                                         <div className="flex justify-between items-start">
                                             <div>
                                                 <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">{item.name}</h3>
                                                 <p className="text-text/70 font-medium text-sm">Qty: {item.quantity} × <span className="font-mono">₹{item.price.toFixed(2)}</span></p>
                                             </div>
                                             <p className="text-text font-black text-lg">₹{(item.quantity * item.price).toFixed(2)}</p>
                                         </div>
                                         {item.notes && (
                                            <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-xs font-bold mt-2 border border-amber-100">
                                                <Icon name="information-circle" size={14} color="#b45309" />
                                                {item.notes}
                                            </div>
                                         )}
                                     </div>

                                     {/* Status Action */}
                                     <button
                                       className="self-center sm:self-auto bg-ivory text-text/70 border border-ivory-200 rounded-xl px-4 py-3 flex items-center transition-all ml-2"
                                       onClick={() => updateItemStatus(item.id)}
                                     >
                                         <span className="text-xs font-bold hidden sm:block mr-2 uppercase tracking-wide">{item.status}</span>
                                         <Icon name="arrow-forward" size={16} color="currentColor" />
                                     </button>
                                 </div>
                             </Animated>
                        ))}
                    </div>
                 </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1 space-y-6">
                 {/* Summary Card */}
                 <div className="bg-white rounded-[32px] shadow-card border border-slate-100 p-8 sticky top-6">
                      <h3 className="text-slate-900 font-serif text-2xl mb-6">Order Summary</h3>
                      
                      <div className="space-y-4 mb-8">
                         <div className="flex justify-between items-center text-text/70">
                             <span className="font-medium">Subtotal</span>
                             <span className="font-bold text-text">₹{orderInfo.subtotal.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center text-text/70">
                             <span className="font-medium">Tax (8%)</span>
                             <span className="font-bold text-text">₹{orderInfo.tax.toFixed(2)}</span>
                         </div>
                         <div className="h-px bg-ivory-200 my-2"></div>
                         <div className="flex justify-between items-center">
                             <span className="text-lg font-bold text-text">Total</span>
                             <span className="text-3xl font-black text-primary">₹{orderInfo.total.toFixed(2)}</span>
                         </div>
                      </div>

                      {role === 'cashier' ? (
                        <button
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative"
                          onClick={handleProceedToPayment}
                        >
                             <div className="absolute inset-0 bg-linear-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <div className="relative flex items-center justify-center gap-3">
                                 <Icon name="wallet" size={24} color="white" />
                                 <span className="font-bold text-lg">Proceed to Payment</span>
                             </div>
                        </button>
                      ) : (
                         <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3 text-blue-800 border border-blue-100">
                             <Icon name="information-circle" size={24} color="#1e40af" />
                             <p className="text-sm font-medium">Payment is handled by the cashier console.</p>
                         </div>
                      )}
                 </div>
            </div>
        </div>
      </div>

       {/* Payment Modal */}
       {showPaymentModal && (
         <div
           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
           onClick={() => setShowPaymentModal(false)}
         >
           <Animated type="fadeInUp" duration={0.3} className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden">
             <div onClick={(e) => e.stopPropagation()}>
              <div className="bg-primary px-8 py-6 flex justify-between items-center">
                  <div>
                      <h2 className="text-2xl font-serif text-white">Process Payment</h2>
                      <p className="text-white/80 text-sm mt-1">{orderInfo.table}</p>
                  </div>
                  <button
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    <Icon name="close" size={24} color="white" />
                  </button>
              </div>
              
              <div className="p-8">
                  <div className="mb-8">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Select Method</p>
                      <div className="grid grid-cols-2 gap-4">
                         {paymentMethods.map((method) => (
                            <button
                              key={method.id}
                              className={`rounded-2xl p-4 border-2 transition-all flex flex-col items-center gap-2 ${selectedPaymentMethod === method.id
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-100 bg-white hover:border-slate-200'
                                }`}
                              onClick={() => setSelectedPaymentMethod(method.id)}
                            >
                              <Icon name={method.icon} size={32} color={method.color} />
                              <span className={`font-bold ${selectedPaymentMethod === method.id ? 'text-primary' : 'text-slate-600'}`}>{method.label}</span>
                            </button>
                         ))}
                      </div>
                  </div>

                  <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                          <p className="text-text/60 text-xs font-bold uppercase tracking-wider">Add Tip</p>
                          {tipAmount && <span className="text-primary font-bold">₹{tipAmount}</span>}
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {tipPresets.map((percent) => (
                          <button
                            key={percent}
                            className={`rounded-xl py-2 font-bold transition-colors ${
                              calculateTipFromPercent(percent) === tipAmount
                                ? 'bg-primary text-white'
                                : 'bg-ivory text-text/70 hover:bg-ivory/80'
                            }`}
                            onClick={() => setTipAmount(calculateTipFromPercent(percent))}
                          >
                            {percent}%
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-ivory-200 px-4 py-3 outline-none focus:border-primary font-bold text-text placeholder:font-normal placeholder:text-text/40"
                        placeholder="Custom amount (₹)"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(e.target.value)}
                      />
                  </div>

                  <button
                     className={`w-full rounded-xl py-4 flex items-center justify-center transition-all ${
                       !selectedPaymentMethod
                         ? 'opacity-50 cursor-not-allowed bg-ivory'
                         : 'bg-gold hover:bg-gold/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                     }`}
                     onClick={handleConfirmPayment}
                     disabled={!selectedPaymentMethod}
                   >
                     <Icon name="checkmark-circle" size={24} color={!selectedPaymentMethod ? "#8B1D1D" : "white"} />
                     <span className={`font-bold text-lg ml-2 ${!selectedPaymentMethod ? 'text-text/60' : 'text-white'}`}>Confirm Payment</span>
                  </button>
              </div>
             </div>
           </Animated>
         </div>
       )}
    </div>
  );
}
