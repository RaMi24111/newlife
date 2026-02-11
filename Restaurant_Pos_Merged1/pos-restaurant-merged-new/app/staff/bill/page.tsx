'use client';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';
import { Animated } from '../components/Animated';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationState } from '../contexts/NavigationContext';

export default function Bill() {
  const { role } = useAuth();
  const router = useRouter();
  const { navState } = useNavigationState();

  const orderNumber = (navState?.orderNumber as string)?.startsWith('#')
    ? navState.orderNumber
    : `#${navState?.orderNumber ?? '12345'}`;
  const table = (navState?.table as string) ?? 'Table 5';
  const orderTotal = parseFloat((navState?.orderTotal as string) ?? '97.12');
  const tipAmount = parseFloat((navState?.tipAmount as string) ?? '14.57');
  const finalTotal = parseFloat((navState?.finalTotal as string) ?? '111.69');
  const paymentMethod = (navState?.paymentMethod as string) ?? 'cash';
  const billNumber = (navState?.billNumber as string) ?? `BILL-${Date.now().toString().slice(-8)}`;
  const date = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="min-h-screen bg-ivory flex flex-col font-sans">
       {/* Background Patterns */}
       <div className="fixed inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
       </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
         <div className="w-full max-w-lg">
            <Animated type="fadeInUp" duration={0.4}>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative">
                  {/* Decorative serrated edge at top */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                  
                  <div className="p-8 md:p-12">
                     {/* Success Icon */}
                     <div className="flex flex-col items-center mb-8">
                         <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                             <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                                <Icon name="checkmark" size={28} color="white" />
                             </div>
                         </div>
                         <h1 className="text-2xl font-serif font-black text-slate-900 text-center">Payment Successful</h1>
                         <p className="text-slate-500 text-center mt-1">Transaction Completed</p>
                     </div>

                     {/* Receipt Card */}
                     <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 relative overflow-hidden">
                        {/* Receipt texture overlay or just simple styling */}
                         <div className="space-y-4">
                              <div className="flex justify-between items-center pb-4 border-b border-dashed border-slate-200">
                                  <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Amount</span>
                                  <span className="text-3xl font-black text-slate-900">₹{finalTotal.toFixed(2)}</span>
                              </div>
                              
                              <div className="space-y-3 pt-2">
                                  <div className="flex justify-between">
                                      <span className="text-slate-600">Bill Number</span>
                                      <span className="text-slate-900 font-bold font-mono">{billNumber}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-slate-600">Table</span>
                                      <span className="text-slate-900 font-bold">{table}</span>
                                  </div>
                                   <div className="flex justify-between">
                                      <span className="text-slate-600">Date</span>
                                      <span className="text-slate-900 font-bold">{date}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-slate-600">Payment Method</span>
                                      <span className="text-slate-900 font-bold capitalize flex items-center">
                                          <span className="mr-2 text-lg">{paymentMethod === 'cash' ? '💵' : paymentMethod === 'card' ? '💳' : '📱'}</span>
                                          {paymentMethod}
                                      </span>
                                  </div>
                              </div>
                         </div>
                     </div>

                     {/* Breakdown */}
                     <div className="space-y-3 mb-8 px-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="text-slate-900 font-semibold">₹{orderTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Tip</span>
                            <span className="text-slate-900 font-semibold">₹{tipAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg pt-2 border-t border-slate-100">
                             <span className="text-slate-900 font-bold">Total Paid</span>
                             <span className="text-primary font-black">₹{finalTotal.toFixed(2)}</span>
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="flex flex-col gap-3">
                         <button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center transition-colors shadow-lg"
                             onClick={() => console.log('Print receipt')}
                         >
                            <Icon name="print-outline" size={20} color="white" className="mr-2" />
                            Print Receipt
                         </button>
                         <button
                            className="w-full bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 py-4 rounded-xl font-bold transition-colors"
                            onClick={() => router.replace(role === 'cashier' ? '/billing-payment' : '/staff-dashboard')}
                         >
                            Back to {role === 'cashier' ? 'Billing' : 'Dashboard'}
                         </button>
                     </div>

                  </div>
              </div>
            </Animated>
         </div>
      </div>
    </div>
  );
}
