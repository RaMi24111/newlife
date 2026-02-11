"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  qty: number;
  parcel: boolean;
  notes: string;
}

const PARCEL_CHARGE = 20;
const GST_RATE = 0.05;

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("Guest");
  const [sessionKey, setSessionKey] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("customerName") || "Guest";
    const table = localStorage.getItem("tableNumber") || "";

    setCustomerName(name);
    if (!name || !table) return;

    const key = `currentCart_${table}_${name}`;
    setSessionKey(key);

    const stored = localStorage.getItem(key);
    setCart(stored ? JSON.parse(stored) : []);
  }, []);

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    if (sessionKey) localStorage.setItem(sessionKey, JSON.stringify(updated));
  };

  const incQty = (id: number) =>
    saveCart(cart.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

  const decQty = (id: number) =>
    saveCart(
      cart
        .map(i => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter(i => i.qty > 0)
    );

  const deleteItem = (id: number) =>
    saveCart(cart.filter(i => i.id !== id));

  const toggleParcel = (id: number) =>
    saveCart(cart.map(i => (i.id === id ? { ...i, parcel: !i.parcel } : i)));

  const updateNotes = (id: number, notes: string) =>
    saveCart(cart.map(i => (i.id === id ? { ...i, notes } : i)));

  const subtotal = cart.reduce((sum, item) => {
    const base = item.price * item.qty;
    const parcel = item.parcel ? PARCEL_CHARGE * item.qty : 0;
    return sum + base + parcel;
  }, 0);

  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;

  return (
    <div className="min-h-screen pb-48 bg-gradient-to-br from-[#FBF6EE] via-[#F5EFE0] to-[#FBF6EE]">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#5D1616] via-[#7B1F1F] to-[#5D1616] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="px-4 py-4 flex items-center justify-between text-[#FFF8E1] max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/customer/menu")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#FFD700] font-semibold relative overflow-hidden transition-all duration-300 hover:brightness-110"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(135deg, #FFD700 0%, #FFC107 100%)",
              color: "#5D1616",
            }}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="#5D1616"
            >
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Menu
          </button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <p className="text-lg font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>My Cart</p>
            </div>
            <p className="text-xs opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {customerName} • Table 1
            </p>
          </div>

          <div className="w-20" />
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-4xl mx-auto">
        {/* EMPTY CART STATE */}
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
            <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-[#C8A951]/20 to-[#D4B76E]/20 flex items-center justify-center border-2 border-[#C8A951]/30">
              <svg className="w-16 h-16 text-[#7B1F1F]/40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#5D1616] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your cart is empty
            </h3>
            <p className="text-[#7B1F1F]/70 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Add items from the menu to get started
            </p>
            <button
              onClick={() => router.push("/customer/menu")}
              className="px-6 py-3 bg-gradient-to-r from-[#7B1F1F] to-[#5D1616] text-[#C8A951] rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Browse Menu
            </button>
          </div>
        )}

        {/* CART ITEMS */}
        {cart.length > 0 && (
          <div className="px-4 mt-5 space-y-4">
            {cart.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-[#C8A951]/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden animate-slide-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* IMAGE */}
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#C8A951]/40 flex-shrink-0 group">
                      <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    {/* INFO */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#5D1616] text-base truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#7B1F1F]/60 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300 flex items-center justify-center flex-shrink-0"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </button>
                      </div>

                      {/* QTY + PRICE */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center bg-gradient-to-r from-[#C8A951]/10 to-[#D4B76E]/10 border-2 border-[#C8A951]/40 rounded-lg overflow-hidden">
                          <button
                            onClick={() => decQty(item.id)}
                            className="w-9 h-9 text-[#5D1616] font-bold hover:bg-[#C8A951]/20 transition-colors duration-300"
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-[#5D1616]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => incQty(item.id)}
                            className="w-9 h-9 text-[#5D1616] font-bold hover:bg-[#C8A951]/20 transition-colors duration-300"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-[#7B1F1F]/60" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            ₹{item.price} × {item.qty}
                          </p>
                          <p className="text-lg font-bold text-[#5D1616]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            ₹{item.price * item.qty + (item.parcel ? PARCEL_CHARGE * item.qty : 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PARCEL OPTION */}
                  <div className="mt-4 flex justify-between items-center bg-gradient-to-r from-[#C8A951]/10 to-[#D4B76E]/10 border-2 border-[#C8A951]/30 rounded-xl px-4 py-3 hover:border-[#C8A951]/50 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#7B1F1F]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                      </svg>
                      <span className="text-sm font-semibold text-[#5D1616]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Pack as Parcel <span className="text-[#7B1F1F]/60">(+₹{PARCEL_CHARGE})</span>
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.parcel}
                        onChange={() => toggleParcel(item.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#7B1F1F] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>

                  {/* NOTES */}
                  <textarea
                    value={item.notes}
                    onChange={e => updateNotes(item.id, e.target.value)}
                    placeholder="Add cooking instructions or preferences..."
                    rows={2}
                    className="mt-3 w-full text-sm border-2 border-[#C8A951]/30 rounded-xl px-4 py-3 bg-white/80 text-[#2D0A0F] placeholder-[#7B1F1F]/40 focus:border-[#C8A951] focus:outline-none focus:ring-2 focus:ring-[#C8A951]/20 transition-all duration-300"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-[#C8A951]/50 px-4 py-5 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-40">
          <div className="space-y-3 text-sm max-w-md mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="flex justify-between text-[#5D1616]">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#5D1616]">
              <span>GST (5%)</span>
              <span className="font-semibold">₹{gst.toFixed(2)}</span>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[#C8A951]/50 to-transparent" />

            <div className="flex justify-between font-bold text-xl text-[#5D1616]">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push("/customer/payment")}
              className="group w-full mt-3 py-4 rounded-xl text-white font-bold tracking-wide bg-gradient-to-r from-[#7B1F1F] to-[#5D1616] shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>PROCEED TO PAYMENT</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600;700&display=swap');

        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-up { animation: slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
