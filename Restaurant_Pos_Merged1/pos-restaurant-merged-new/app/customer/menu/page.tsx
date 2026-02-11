"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
interface FoodItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  type: "veg" | "nonveg";
}

interface CartItem extends FoodItem {
  qty: number;
  parcel: boolean;
  notes: string;
}

/* ================= PAGE ================= */
export default function MenuPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("Guest");
  const [tableNumber, setTableNumber] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  /* ================= DATA ================= */
  const foodItems: FoodItem[] = [
    { id: 1, name: "Paneer Tikka", description: "Grilled cottage cheese with aromatic spices", category: "Starters", price: 250, image: "/images/paneer.jpg", type: "veg" },
    { id: 2, name: "Chicken Tikka", description: "Tender chicken marinated in traditional spices", category: "Starters", price: 280, image: "/images/chicken.jpg", type: "nonveg" },
    { id: 3, name: "Veg Spring Rolls", description: "Crispy rolls filled with fresh vegetables", category: "Starters", price: 180, image: "/images/springroll.jpg", type: "veg" },
    { id: 4, name: "Dal Makhani", description: "Creamy black lentils slow-cooked to perfection", category: "Main Course", price: 220, image: "/images/dal.jpg", type: "veg" },
    { id: 5, name: "Butter Chicken", description: "Classic creamy tomato curry with tender chicken", category: "Main Course", price: 320, image: "/images/butter.jpg", type: "nonveg" },
    { id: 6, name: "Jeera Rice", description: "Fragrant basmati rice with cumin", category: "Rice", price: 150, image: "/images/rice.jpg", type: "veg" },
  ];

  const categories = ["All", "Starters", "Main Course", "Rice"];
  const sliderImages = ["/images/paneer.jpg", "/images/rice.jpg", "/images/butter.jpg", "/images/dal.jpg", "/images/springroll.jpg"];

  /* ================= STORAGE ================= */
  useEffect(() => {
    const name = localStorage.getItem("customerName") || "Guest";
    const table = localStorage.getItem("tableNumber") || "";
    setCustomerName(name);
    setTableNumber(table);

    if (name && table) {
      const key = `currentCart_${table}_${name}`;
      const stored = localStorage.getItem(key);
      // Only load cart if it exists, otherwise start with empty cart
      if (stored) {
        setCart(JSON.parse(stored));
      }
    }

    setTimeout(() => setLoading(false), 800);
  }, []);

  // Stagger animation for items
  useEffect(() => {
    if (!loading) {
      filteredItems.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 100);
      });
    }
  }, [loading, selectedCategory, searchText]);

  const sessionKey = useMemo(() => {
    if (!customerName || !tableNumber) return "";
    return `currentCart_${tableNumber}_${customerName}`;
  }, [customerName, tableNumber]);

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    if (sessionKey) localStorage.setItem(sessionKey, JSON.stringify(updated));
  };

  const addItem = (item: FoodItem) => {
    const updated = [...cart];
    const idx = updated.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      updated[idx].qty += 1;
    } else {
      updated.push({ ...item, qty: 1, parcel: false, notes: "" });
    }
    saveCart(updated);
    showToast(`${item.name} added to cart`);
  };

  const removeItem = (id: number) => {
    saveCart(
      cart
        .map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0)
    );
  };

  const getQty = (id: number) => cart.find(i => i.id === id)?.qty || 0;
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  const filteredItems = useMemo(() => {
    let items = selectedCategory === "All"
      ? foodItems
      : foodItems.filter(i => i.category === selectedCategory);
    if (searchText)
      items = items.filter(i => i.name.toLowerCase().includes(searchText.toLowerCase()));
    
    setVisibleItems([]);
    return items;
  }, [selectedCategory, searchText]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF6EE] via-[#F5EFE0] to-[#FBF6EE] pb-24 relative overflow-x-hidden">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#5D1616] via-[#7B1F1F] to-[#5D1616] shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <div className="px-4 py-3 max-w-7xl mx-auto">
          {/* Top Row: Welcome & Table Number */}
          <div className="flex justify-between items-center mb-3">
            <div style={{ fontFamily: "'Poppins', sans-serif" }}>
              <p className="text-xs text-[#E8DCC8]/70">Welcome</p>
              <p className="text-sm font-semibold text-[#FFF8E1]">{customerName}</p>
            </div>
            
            <div className="flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <svg className="w-4 h-4 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z"/>
              </svg>
              <span className="text-sm font-bold text-[#C8A951]">Table {tableNumber}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#2D0A0F]/40 border-2 border-[#C8A951]/30 text-[#FFF8E1] placeholder-[#E8DCC8]/50 focus:border-[#C8A951] focus:outline-none transition-all duration-300"
                style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px" }}
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A951]/60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E8DCC8]/70 hover:text-[#C8A951] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/customer/cart")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#2D0A0F]/40 border-2 border-[#C8A951]/30 hover:border-[#C8A951]/60 hover:bg-[#2D0A0F]/60 transition-all duration-300"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <svg className="w-5 h-5 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span className="text-sm font-semibold text-[#FFF8E1]">Cart</span>
              {totalQty > 0 && (
                <span className="w-5 h-5 bg-[#C8A951] text-[#2D0A0F] text-xs rounded-full flex items-center justify-center font-bold animate-scale-pulse">
                  {totalQty}
                </span>
              )}
            </button>

            <button
              onClick={() => router.push("/customer/order-status")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#2D0A0F]/40 border-2 border-[#C8A951]/30 hover:border-[#C8A951]/60 hover:bg-[#2D0A0F]/60 transition-all duration-300"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <svg className="w-5 h-5 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-sm font-semibold text-[#FFF8E1]">Status</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4">
        {/* FLOWING IMAGE CAROUSEL */}
        <div className="overflow-hidden relative h-32 my-4 border-y-2 border-[#C8A951]/20 rounded-xl">
          <div className="flex animate-marquee-fast gap-3">
            {sliderImages.concat(sliderImages, sliderImages).map((img, i) => (
              <div key={i} className="min-w-[220px] h-32 relative rounded-xl overflow-hidden border-2 border-[#C8A951]/30 shadow-lg group">
                <Image src={img} fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt={`Dish ${i}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D0A0F]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* SUGGESTIONS */}
        <div className="py-3">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-[#7B1F1F]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <h2 className="text-lg font-bold text-[#5D1616]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Chef's Recommendations
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {foodItems.slice(0, 4).map((item, idx) => (
              <div 
                key={item.id} 
                className="min-w-[160px] relative rounded-xl overflow-hidden border-2 border-[#C8A951]/40 shadow-lg hover:shadow-2xl hover:scale-105 hover:-rotate-1 transition-all duration-500 cursor-pointer animate-slide-in-right"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => addItem(item)}
              >
                <div className="relative aspect-square">
                  <Image src={item.image} fill className="object-cover" alt={item.name} />
                  <div className="absolute top-2 right-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.type === "veg" ? "bg-green-600" : "bg-red-600"}`}>
                      <div className={`w-2 h-2 rounded-full ${item.type === "veg" ? "bg-green-300" : "bg-red-300"}`} />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2D0A0F]/95 to-transparent p-2">
                  <p className="text-xs font-bold text-[#C8A951] truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.name}</p>
                  <p className="text-xs text-[#E8DCC8]" style={{ fontFamily: "'Poppins', sans-serif" }}>₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat, idx) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-500 animate-fade-in ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#7B1F1F] to-[#5D1616] text-[#C8A951] shadow-lg scale-105 border-2 border-[#C8A951]/50"
                  : "bg-white/80 text-[#5D1616] border-2 border-[#C8A951]/20 hover:border-[#C8A951]/50 hover:shadow-md"
              }`}
              style={{ fontFamily: "'Poppins', sans-serif", animationDelay: `${idx * 0.1}s` }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MENU GRID - Responsive columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {(loading ? Array(6).fill(0) : filteredItems).map((item, idx) => {
            if (loading) {
              return (
                <div key={idx} className="bg-white/80 rounded-2xl overflow-hidden shadow-lg h-64 animate-pulse">
                  <div className="bg-gradient-to-br from-[#E8DCC8]/50 to-[#C8A951]/20 h-40" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-[#E8DCC8]/50 rounded w-3/4" />
                    <div className="h-3 bg-[#E8DCC8]/30 rounded w-1/2" />
                  </div>
                </div>
              );
            }

            const qty = getQty(item.id);
            const isVisible = visibleItems.includes(idx);
            const isFromLeft = idx % 2 === 0;
            
            return (
              <div
                key={item.id}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border-2 border-[#C8A951]/20 hover:border-[#C8A951]/60 hover:shadow-2xl hover:scale-[1.03] transition-all duration-700 ${
                  isVisible 
                    ? 'animate-slide-in-visible opacity-100' 
                    : `opacity-0 ${isFromLeft ? 'animate-slide-from-left' : 'animate-slide-from-right'}`
                }`}
                style={{ 
                  animationDelay: `${idx * 0.15}s`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="relative aspect-square group overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D0A0F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-3 left-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                      item.type === "veg" 
                        ? "bg-green-600 border-green-300" 
                        : "bg-red-600 border-red-300"
                    } shadow-lg`}>
                      <div className={`w-3 h-3 rounded-full ${
                        item.type === "veg" ? "bg-green-200" : "bg-red-200"
                      }`} />
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-bold text-[#5D1616] truncate mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#7B1F1F]/70 line-clamp-1 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-[#5D1616] text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ₹{item.price}
                    </span>
                    
                    {qty === 0 ? (
                      <button 
                        onClick={() => addItem(item)} 
                        className="group px-4 py-2 bg-gradient-to-r from-[#C8A951] to-[#D4B76E] text-[#2D0A0F] rounded-lg font-bold text-xs shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-1"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        <svg className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-[#C8A951]/20 to-[#D4B76E]/20 rounded-lg px-2 py-1 border-2 border-[#C8A951]/40">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 flex items-center justify-center bg-[#7B1F1F] text-[#C8A951] rounded-md font-bold hover:bg-[#5D1616] transition-colors duration-300"
                        >
                          −
                        </button>
                        <span className="font-bold text-[#5D1616] min-w-[20px] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {qty}
                        </span>
                        <button 
                          onClick={() => addItem(item)}
                          className="w-7 h-7 flex items-center justify-center bg-[#7B1F1F] text-[#C8A951] rounded-md font-bold hover:bg-[#5D1616] transition-colors duration-300"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#2D0A0F]/95 text-[#C8A951] px-6 py-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 animate-toast-slide border-2 border-[#C8A951]/30 backdrop-blur-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            {toast}
          </div>
        </div>
      )}

      {/* BOTTOM VIEW CART BUTTON */}
      {totalQty > 0 && (
        <button 
          onClick={() => router.push("/customer/cart")} 
          className="fixed bottom-4 left-4 right-4 max-w-7xl mx-auto bg-gradient-to-r from-[#7B1F1F] via-[#5D1616] to-[#7B1F1F] text-[#C8A951] px-6 py-4 font-bold text-lg shadow-[0_10px_40px_rgba(0,0,0,0.4)] z-40 rounded-xl border-2 border-[#C8A951]/50 hover:scale-[1.02] transition-all duration-300 animate-slide-up"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span>VIEW CART</span>
            </div>
            <span className="bg-[#C8A951] text-[#2D0A0F] px-3 py-1 rounded-full text-sm font-bold">
              {totalQty} {totalQty === 1 ? 'item' : 'items'}
            </span>
          </div>
        </button>
      )}

      {/* ANIMATIONS */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Poppins:wght@400;500;600;700&display=swap');

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes marquee-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-fast { animation: marquee-fast 15s linear infinite; }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes slide-from-left {
          from { opacity: 0; transform: translateX(-50px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-slide-from-left { animation: slide-from-left 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes slide-from-right {
          from { opacity: 0; transform: translateX(50px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-slide-from-right { animation: slide-from-right 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes slide-in-visible {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-in-visible { animation: slide-in-visible 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

        @keyframes toast-slide {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-toast-slide { animation: toast-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes scale-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-scale-pulse { animation: scale-pulse 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
