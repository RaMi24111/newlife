'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';
import { Gradient } from '../components/Gradient';
import { Animated } from '../components/Animated';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationState } from '../contexts/NavigationContext';

type BillingStatus = 'unpaid' | 'pending' | 'paid';
type PaymentMethod = 'cash' | 'upi';

interface TableBilling {
  id: string;
  table: string;
  items: number;
  total: number;
  status: BillingStatus;
  time: string;
  orderItems?: { name: string; qty: number; price: number }[];
}

export default function BillingPayment() {
  const { role } = useAuth();
  const router = useRouter();
  const { setNavState } = useNavigationState();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [tipAmount, setTipAmount] = useState('');
  const [tableForPayment, setTableForPayment] = useState<TableBilling | null>(null);
  const [showRevenueView, setShowRevenueView] = useState(false);

  useEffect(() => {
    if (role === 'server') {
      router.push('/staff/staff-dashboard');
    }
  }, [role, router]);

  const allTablesBilling: TableBilling[] = [
    { id: '1', table: 'Table 1', items: 4, total: 560, status: 'paid', time: '10:30 AM' },
    { id: '2', table: 'Table 2', items: 2, total: 320, status: 'unpaid', time: '11:15 AM' },
    { id: '3', table: 'Table 3', items: 6, total: 890, status: 'pending', time: '11:45 AM' },
    { id: '4', table: 'Table 5', items: 3, total: 450, status: 'unpaid', time: '12:00 PM' },
    { id: '5', table: 'Table 7', items: 5, total: 720, status: 'paid', time: '12:30 PM' },
    { id: '6', table: 'Table 8', items: 2, total: 280, status: 'pending', time: '1:00 PM' },
  ];

  const billingFilters = [
    { id: 'all', label: 'All', count: allTablesBilling.length },
    { id: 'unpaid', label: 'Unpaid', count: allTablesBilling.filter(t => t.status === 'unpaid').length, color: '#ef4444' },
    { id: 'pending', label: 'Pending', count: allTablesBilling.filter(t => t.status === 'pending').length, color: '#f59e0b' },
    { id: 'paid', label: 'Paid', count: allTablesBilling.filter(t => t.status === 'paid').length, color: '#C8A951' },
  ];

  const paymentMethods = [
    { id: 'cash' as PaymentMethod, label: 'Cash', icon: 'cash-outline' as const, color: '#C8A951' },
    { id: 'upi' as PaymentMethod, label: 'UPI', icon: 'phone-portrait-outline' as const, color: '#7B1F1F' },
  ];

  const tipPresets = [0, 10, 15, 20];

  const filteredBilling = activeFilter === 'all' ? allTablesBilling : allTablesBilling.filter(item => item.status === activeFilter);
  const totalUnpaid = allTablesBilling.filter(t => t.status === 'unpaid').reduce((sum, t) => sum + t.total, 0);
  const totalPending = allTablesBilling.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.total, 0);
  const totalPaid = allTablesBilling.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.total, 0);
  const grandTotal = totalUnpaid + totalPending + totalPaid;

  const tableRevenueMap = allTablesBilling.reduce((acc, bill) => {
    const tableName = bill.table;
    if (!acc[tableName]) {
      acc[tableName] = { total: 0, orders: 0 };
    }
    acc[tableName].total += bill.total;
    acc[tableName].orders += 1;
    return acc;
  }, {} as Record<string, { total: number; orders: number }>);

  const tableRevenueList = Object.entries(tableRevenueMap)
    .map(([table, data]) => ({ table, ...data }))
    .sort((a, b) => {
      const getTableNumber = (tableName: string) => {
        const match = tableName.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      return getTableNumber(a.table) - getTableNumber(b.table);
    });

  const getStatusConfig = (status: BillingStatus) => {
    switch (status) {
      case 'unpaid':
        return {
          label: 'UNPAID',
          bg: '#FEE2E2',
          color: '#DC2626',
          icon: 'alert-circle' as const,
        };
      case 'pending':
        return {
          label: 'PENDING',
          bg: '#FEF3C7',
          color: '#D97706',
          icon: 'time' as const,
        };
      case 'paid':
        return {
          label: 'PAID',
          bg: '#D1FAE5',
          color: '#059669',
          icon: 'checkmark-circle' as const,
        };
    }
  };

  const openPaymentModal = (table: TableBilling) => {
    setTableForPayment(table);
    setSelectedPaymentMethod(null);
    setTipAmount('');
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (!tableForPayment || !selectedPaymentMethod) return;
    const taxAmount = tableForPayment.total * 0.05;
    const tip = parseFloat(tipAmount) || 0;
    const finalTotal = tableForPayment.total + taxAmount + tip;
    setShowPaymentModal(false);
    
    setNavState({
      orderNumber: tableForPayment.id,
      table: tableForPayment.table,
      orderTotal: (tableForPayment.total + taxAmount).toFixed(2),
      tipAmount: tip.toFixed(2),
      finalTotal: finalTotal.toFixed(2),
      paymentMethod: selectedPaymentMethod
    });

    router.push('/staff/bill');
  };

  const calculateTipFromPercent = (percent: number) => {
    if (!tableForPayment) return '0';
    const taxAmount = tableForPayment.total * 0.05;
    return ((tableForPayment.total + taxAmount) * percent / 100).toFixed(0);
  };

  const BillCard = ({ item, index }: { item: TableBilling; index: number }) => {
    const config = getStatusConfig(item.status);

    return (
      <Animated type="fadeInUp" delay={index * 0.08} duration={0.4}>
        <div className="bg-white rounded-3xl mb-4 overflow-hidden shadow-card">
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ backgroundColor: config.bg }}
          >
            <div className="flex items-center">
              <div className="mr-2">
                 <Icon name={config.icon} size={20} color={config.color} />
              </div>
              <span
                className="font-black text-sm tracking-wide"
                style={{ color: config.color }}
              >
                {config.label}
              </span>
            </div>
            <span className="text-xs font-medium" style={{ color: config.color }}>
              {item.time}
            </span>
          </div>

          <div className="w-full p-5 text-left cursor-default">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mr-4">
                  <Icon name="restaurant" size={28} color="#8B1D1D" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-xl">{item.table}</p>
                  <p className="text-slate-500 text-sm mt-1">{item.items} items</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 font-black text-2xl">₹{item.total}</p>
              </div>
            </div>

            {(item.status === 'unpaid' || item.status === 'pending') && (
              <button
                className="w-full mt-4 rounded-2xl overflow-hidden hover:scale-[0.98] transition-transform"
                onClick={(e) => { e.stopPropagation(); openPaymentModal(item); }}
              >
                <Gradient
                  colors={['#C8A951', '#B8993D']}
                  className="py-3 flex items-center justify-center"
                >
                  <Icon name="wallet" size={18} color="white" />
                  <span className="text-white font-bold text-sm ml-2">Process Payment</span>
                </Gradient>
              </button>
            )}
          </div>
        </div>
      </Animated>
    );
  };

  return (

    <div className="min-h-screen bg-ivory flex flex-col font-sans">
      {/* Header Section */}
      <div className="relative bg-primary py-12 md:py-16 shadow-2xl overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div>
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-2 tracking-tight drop-shadow-md">
                  Billing & Payments
                </h1>
                <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase opacity-90">
                  Transaction Management
                </p>
            </div>
            <div className="flex gap-4">

                   <button
                    className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10"
                    onClick={() => setShowRevenueView(!showRevenueView)}
                  >
                    <Icon name={showRevenueView ? "wallet" : "stats-chart"} size={24} color="#FFFFFF" />
                  </button>

            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-20">
        
        {/* Stats Grid - mimicking Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Revenue */}
            <div className="bg-white rounded-[32px] p-6 shadow-card flex items-center border border-[#E2E8F0]">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mr-6">
                    <Icon name="wallet" size={32} color="#d97706" />
                </div>
                <div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</h3>
                    <p className="text-3xl font-serif font-black text-slate-900">₹{grandTotal.toLocaleString()}</p>
                </div>
            </div>

            {/* Collected */}
            <div className="bg-white rounded-[32px] p-6 shadow-card flex items-center border border-[#E2E8F0]">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mr-6">
                    <Icon name="cash" size={32} color="#059669" />
                </div>
                <div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Collected</h3>
                    <p className="text-3xl font-serif font-black text-slate-900">₹{totalPaid.toLocaleString()}</p>
                </div>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-[32px] p-6 shadow-card flex items-center border border-[#E2E8F0]">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mr-6">
                    <Icon name="time" size={32} color="#dc2626" />
                </div>
                <div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending</h3>
                    <p className="text-3xl font-serif font-black text-slate-900">₹{(totalUnpaid + totalPending).toLocaleString()}</p>
                </div>
            </div>
        </div>

        {/* Transactions Section - Mimicking Active Orders Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-[24px] md:rounded-[40px] p-6 md:p-12 shadow-card border border-white/50">
           {!showRevenueView ? (
             <>
               <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <div>
                      <h2 className="text-3xl font-serif text-slate-900 mb-2">Transactions</h2>
                      <p className="text-slate-500">Manage bills and process payments.</p>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2">
                    {billingFilters.map((item) => (
                       <button
                         key={item.id}
                         className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center ${activeFilter === item.id
                           ? 'bg-primary text-white shadow-md'
                           : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                           }`}
                         onClick={() => setActiveFilter(item.id)}
                       >
                         {item.label}
                         <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {item.count}
                         </span>
                       </button>
                    ))}
                  </div>
               </div>

               {filteredBilling.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {filteredBilling.map((item, index) => (
                         <BillCard key={item.id} item={item} index={index} />
                     ))}
                 </div>
               ) : (
                 <Animated type="fadeIn" duration={0.4} className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Icon name="receipt-outline" size={32} color="#94a3b8" />
                      </div>
                      <p className="text-slate-900 text-lg font-bold">No {activeFilter} bills found</p>
                 </Animated>
               )}
             </>
           ) : (
             <>
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                  <div>
                      <h2 className="text-3xl font-serif text-slate-900 mb-2">Revenue by Table</h2>
                      <p className="text-slate-500">Breakdown of earnings per table.</p>
                  </div>
                   <button 
                     onClick={() => setShowRevenueView(false)}
                     className="mt-4 md:mt-0 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold transition-colors hover:bg-slate-50"
                  >
                      Back to Transactions
                  </button>
               </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tableRevenueList.map((tableData, index) => (
                    <Animated key={tableData.table} type="fadeInUp" delay={index * 0.05} duration={0.4}>
                        <div
                          className="bg-white rounded-2xl p-6 flex items-center justify-between hover:shadow-lg transition-all border border-[#E2E8F0] h-full"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                               <Icon name="restaurant" size={24} color="#8B1D1D" />
                            </div>
                            <div>
                              <p className="text-slate-900 font-bold text-lg">{tableData.table}</p>
                              <p className="text-slate-500 text-sm">{tableData.orders} orders</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-primary font-black text-2xl">₹{tableData.total}</p>
                          </div>
                        </div>
                    </Animated>
                  ))}
                </div>
             </>
           )}
        </div>
      </div>

       {/* Payment Modal (Overlay) */}
       {showPaymentModal && tableForPayment && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <Animated type="fadeInUp" duration={0.3} className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden">
             <div onClick={(e) => e.stopPropagation()}>
               <div className="bg-primary px-8 py-6 flex justify-between items-center">
                   <div>
                       <h2 className="text-2xl font-serif text-white">Process Payment</h2>
                       <p className="text-white/80 text-sm mt-1">{tableForPayment.table}</p>
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
                                 : 'border-[#E2E8F0] bg-white hover:border-slate-200'
                                 }`}
                               onClick={() => setSelectedPaymentMethod(method.id)}
                             >
                               <div className={`${selectedPaymentMethod === method.id ? 'text-primary' : 'text-slate-400'}`}>
                                  <Icon name={method.icon} size={32} color="currentColor" />
                               </div>
                               <span className={`font-bold ${selectedPaymentMethod === method.id ? 'text-primary' : 'text-slate-600'}`}>{method.label}</span>
                             </button>
                          ))}
                       </div>
                   </div>

                   <div className="mb-8">
                       <div className="flex justify-between items-center mb-3">
                           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Add Tip</p>
                           {tipAmount && <span className="text-primary font-bold">₹{tipAmount}</span>}
                       </div>
                       <div className="grid grid-cols-4 gap-2 mb-4">
                         {tipPresets.map((percent) => (
                           <button
                             key={percent}
                             className={`rounded-xl py-2 font-bold transition-colors ${calculateTipFromPercent(percent) === tipAmount ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                             onClick={() => setTipAmount(calculateTipFromPercent(percent))}
                           >
                             {percent}%
                           </button>
                         ))}
                       </div>
                       <input
                         type="number"
                         className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary font-bold text-slate-900 placeholder:font-normal"
                         placeholder="Custom amount (₹)"
                         value={tipAmount}
                         onChange={(e) => setTipAmount(e.target.value)}
                       />
                   </div>

                   <button
                      className={`w-full rounded-xl py-4 flex items-center justify-center transition-all ${!selectedPaymentMethod ? 'opacity-50 cursor-not-allowed bg-slate-200' : 'bg-gold hover:bg-yellow-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}`}
                      onClick={handleConfirmPayment}
                      disabled={!selectedPaymentMethod}
                    >
                      <Icon name="checkmark-circle" size={24} color={!selectedPaymentMethod ? "#94a3b8" : "white"} />
                      <span className={`font-bold text-lg ml-2 ${!selectedPaymentMethod ? 'text-slate-400' : 'text-white'}`}>Confirm Payment</span>
                   </button>
               </div>
             </div>
            </Animated>
          </div>
       )}
    </div>
  );
}
