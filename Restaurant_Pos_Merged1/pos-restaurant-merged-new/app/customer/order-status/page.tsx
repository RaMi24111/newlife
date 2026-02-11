"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PARCEL_CHARGE = 20;

export default function OrderStatusPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState({ name: "", mobile: "", table: "" });
  const [todaysOrders, setTodaysOrders] = useState<any[]>([]);

  const steps = [
    { 
      label: "Order Placed", 
      icon: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
      description: "Your order has been received"
    },
    { 
      label: "Preparing", 
      icon: "M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z",
      description: "Chef is preparing your dishes"
    },
    { 
      label: "Ready", 
      icon: "M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
      description: "Your order is ready to serve"
    },
    { 
      label: "Completed", 
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
      description: "Enjoy your meal!"
    }
  ];

  useEffect(() => {
    const name = localStorage.getItem("customerName") || "Guest";
    const mobile = localStorage.getItem("customerMobile") || "";
    const table = localStorage.getItem("tableNumber") || "1";

    setCustomer({ name, mobile, table });

    // Get all orders and filter for today only
    const ordersKey = `allOrders_${table}_${name}`;
    const allOrders = JSON.parse(localStorage.getItem(ordersKey) || "[]");
    
    const today = new Date().toDateString();
    const todayOrders = allOrders
      .filter((order: any) => new Date(order.date).toDateString() === today)
      .map((order: any) => ({ ...order, activeStep: 0 })); // Add independent step per order

    setTodaysOrders(todayOrders);
  }, []);

  // Animate steps for each order independently
  useEffect(() => {
    const intervals: any[] = [];
    todaysOrders.forEach((order, idx) => {
      const interval = setInterval(() => {
        setTodaysOrders(prev => {
          const newOrders = [...prev];
          if (newOrders[idx].activeStep < steps.length - 1) {
            newOrders[idx].activeStep += 1;
          }
          return newOrders;
        });
      }, 4000);
      intervals.push(interval);
    });
    return () => intervals.forEach(clearInterval);
  }, [todaysOrders.length]);

  const handleAddMore = () => {
    const cartKey = `currentCart_${customer.table}_${customer.name}`;
    localStorage.removeItem(cartKey);
    router.push("/customer/menu");
  };

  const handleDone = () => {
    router.push("/customer/scan-qr");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF6EE] via-[#F5EFE0] to-[#FBF6EE] pb-32">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#5D1616] via-[#7B1F1F] to-[#5D1616] rounded-b-3xl shadow-2xl mb-6 p-6 animate-slide-down">
        <div className="flex items-center justify-center gap-3 max-w-7xl mx-auto">
          <svg className="w-8 h-8 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Order Tracking
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT COLUMN - CUSTOMER DETAILS */}
          <div className="space-y-6">

            {/* CUSTOMER DETAILS */}
            <section className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 border-2 border-[#C8A951]/30 animate-slide-in">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-[#7B1F1F]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <h2 className="text-lg font-bold text-[#5D1616]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Guest Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#C8A951]/5 to-[#D4B76E]/5 rounded-lg border border-[#C8A951]/20">
                  <div>
                    <p className="text-xs text-[#7B1F1F]/60">Name</p>
                    <p className="font-bold text-[#5D1616]" style={{ fontFamily: "'Poppins', sans-serif" }}>{customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#C8A951]/5 to-[#D4B76E]/5 rounded-lg border border-[#C8A951]/20">
                  <div>
                    <p className="text-xs text-[#7B1F1F]/60">Mobile</p>
                    <p className="font-bold text-[#5D1616]" style={{ fontFamily: "'Poppins', sans-serif" }}>{customer.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#C8A951]/5 to-[#D4B76E]/5 rounded-lg border border-[#C8A951]/20">
                  <div>
                    <p className="text-xs text-[#7B1F1F]/60">Table</p>
                    <p className="font-bold text-[#5D1616]" style={{ fontFamily: "'Poppins', sans-serif" }}>#{customer.table}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - TODAY'S ORDERS */}
          <div className="space-y-6">
            {todaysOrders.length > 0 ? todaysOrders.map((order, orderIdx) => (
              <div key={order.id} className="mb-4 last:mb-0 border-2 border-[#C8A951]/30 rounded-xl p-4 bg-gradient-to-br from-white to-[#FBF6EE]/50 hover:shadow-lg transition-shadow duration-300">

                {/* ORDER HEADER */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#7B1F1F]/60" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {new Date(order.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="text-xs bg-[#C8A951]/20 text-[#7B1F1F] px-3 py-1 rounded-full font-semibold">
                    Order #{orderIdx + 1}
                  </span>
                </div>

                {/* ORDER ITEMS */}
                <div className="space-y-2 mb-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <span className="text-[#5D1616]">{item.name} × {item.qty}</span>
                      <span className="font-semibold text-[#5D1616]">
                        ₹{(item.price * item.qty + (item.parcel ? PARCEL_CHARGE * item.qty : 0)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* MOBILE STATUS PER ORDER */}
                <div className="sm:hidden mt-4 space-y-2">
                  {steps.map((step, stepIdx) => {
                    const isCompleted = order.activeStep > stepIdx;
                    const isActive = order.activeStep === stepIdx;
                    return (
                      <div key={stepIdx} className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                            isCompleted
                              ? "bg-gradient-to-br from-[#7B1F1F] to-[#5D1616] shadow-lg"
                              : isActive
                              ? "bg-gradient-to-br from-[#C8A951] to-[#D4B76E] shadow-xl animate-pulse-glow"
                              : "bg-white border-4 border-[#E8DCC8]"
                          }`}
                        >
                          <svg className={`w-6 h-6 ${isCompleted || isActive ? "text-white" : "text-[#C8A951]"}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d={step.icon} />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${isCompleted || isActive ? "text-[#5D1616]" : "text-gray-500"}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {step.label}
                          </p>
                          <p className="text-xs text-[#7B1F1F]/60" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {step.description}
                          </p>
                          {isActive && <span className="text-xs text-[#C8A951] font-semibold">In Progress...</span>}
                          {isCompleted && <span className="text-xs text-green-600 font-semibold">✓ Completed</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ORDER TOTALS */}
                <div className="pt-3 border-t-2 border-[#C8A951]/30">
                  <div className="flex justify-between text-xs text-[#5D1616] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#5D1616] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span>GST (5%)</span>
                    <span>₹{order.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#5D1616]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span>Total:</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            )) : (
              <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border-2 border-[#C8A951]/30 animate-slide-in text-center">
                <h3 className="text-xl font-bold text-[#5D1616] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>No Orders Yet</h3>
                <button onClick={handleAddMore} className="px-6 py-3 bg-gradient-to-r from-[#7B1F1F] to-[#5D1616] text-[#C8A951] rounded-xl font-semibold">Browse Menu</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-[#C8A951]/50 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-50">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <button onClick={handleAddMore} className="flex-1 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 shadow-lg flex items-center justify-center gap-2" style={{ fontFamily: "'Poppins', sans-serif", background: "linear-gradient(135deg, #C8A951, #D4B76E)", color: "#2D0A0F" }}>Add More Items</button>
          <button onClick={handleDone} className="flex-1 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 shadow-lg flex items-center justify-center gap-2" style={{ fontFamily: "'Poppins', sans-serif", background: "linear-gradient(135deg, #059669, #047857)" }}>Complete</button>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Poppins:wght@400;500;600;700&display=swap');

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(200, 169, 81, 0.5); }
          50% { box-shadow: 0 0 40px rgba(200, 169, 81, 0.8); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

    </div>
  );
}
