"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDetails() {
  const router = useRouter();

  const [tableNumber, setTableNumber] = useState("1");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleContinue = () => {
    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim();

    if (!trimmedName || !trimmedMobile) {
      showToast("Please enter your name and mobile number");
      return;
    }

    if (!/^\d{10}$/.test(trimmedMobile)) {
      showToast("Mobile number must be 10 digits");
      return;
    }

    localStorage.setItem("customerName", trimmedName);
    localStorage.setItem("customerMobile", trimmedMobile);
    localStorage.setItem("tableNumber", tableNumber);

    setLoading(true);

    setTimeout(() => {
      router.push("/customer/menu");
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative">
      {/* LEFT IMAGE - Visible on desktop */}
      <div className="relative hidden lg:block lg:w-1/2 h-screen">
        <Image
          src="/images/bag.jpg"
          alt="Restaurant Interior"
          fill
          priority
          className="object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D0A0F]/60 to-transparent" />
      </div>

      {/* RIGHT FLOATING SLAB - Full width on mobile, half on desktop */}
      <div
        className="relative flex w-full lg:w-1/2 items-center justify-center px-4 sm:px-6 lg:px-12 py-8"
        style={{
          backgroundImage: "url('/images/pattern.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "420px",
        }}
      >
        <div className="absolute inset-0 bg-[#1A0505]/40" />

        {/* Floating Details Card */}
        <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#5D1616]/95 via-[#7B1F1F]/95 to-[#5D1616]/95 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-[#C8A951]/30 overflow-hidden animate-slide-in">
          
          {/* Subtle shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFD700]/5 to-transparent animate-shimmer-slow" />

          {/* Heading with icon */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl font-serif text-[#FFF8E1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Guest Details
            </h1>
          </div>

          {/* Elegant divider */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C8A951]" />
            <svg className="w-3 h-3 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C8A951]" />
          </div>

          {/* Table number display */}
          <div className="mb-6 sm:mb-8 p-4 rounded-xl bg-[#2D0A0F]/30 border border-[#C8A951]/20 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z"/>
              </svg>
              <span className="text-[#E8DCC8] text-base sm:text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Table Number:
              </span>
              <span className="text-[#C8A951] text-lg sm:text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {tableNumber}
              </span>
            </div>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Name input */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 group-focus-within:text-[#C8A951] text-[#C8A951]/60">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="royal-input"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            {/* Mobile input */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 group-focus-within:text-[#C8A951] text-[#C8A951]/60">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                className="royal-input"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            {/* Button or Loader */}
            {!loading ? (
              <button
                onClick={handleContinue}
                className="group mt-2 sm:mt-4 relative w-full rounded-xl bg-gradient-to-r from-[#C8A951] via-[#D4B76E] to-[#C8A951] text-[#2D0A0F] font-bold py-3 sm:py-4 text-base sm:text-lg overflow-hidden shadow-[0_10px_30px_rgba(200,169,81,0.3)] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(200,169,81,0.5)] hover:scale-[1.02]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  CONTINUE TO MENU
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </button>
            ) : (
              <div className="flex flex-col items-center mt-4 sm:mt-6 gap-4">
                <div className="relative">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-4 border-[#2D0A0F]/30 border-t-[#C8A951] animate-spin" />
                  <svg className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 text-[#C8A951]/40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                  </svg>
                </div>
                <p className="text-[#E8DCC8] font-medium text-center text-base sm:text-lg animate-pulse-text px-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Preparing your royal experience...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* TOAST */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#2D0A0F]/95 text-[#C8A951] px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-slide-down z-50 border border-[#C8A951]/30 backdrop-blur-sm max-w-[90%]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span className="text-sm sm:text-base">{toast}</span>
            </div>
          </div>
        )}
      </div>

      {/* GLOBAL ANIMATIONS */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cormorant+Garamond:wght@500&family=Poppins:wght@500;600&display=swap');

        @keyframes slide-in {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-in { animation: slide-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes slide-down {
          from { opacity: 0; transform: translate(-50%, -30px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slide-down { animation: slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes ken-burns {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-ken-burns { animation: ken-burns 25s ease-in-out infinite alternate; }

        @keyframes shimmer-slow {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }
        .animate-shimmer-slow { animation: shimmer-slow 8s linear infinite; }

        @keyframes pulse-text {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-pulse-text { animation: pulse-text 2s ease-in-out infinite; }

        .royal-input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border-radius: 12px;
          border: 2px solid rgba(200, 169, 81, 0.3);
          background: rgba(255, 248, 225, 0.95);
          font-size: 16px;
          font-weight: 500;
          color: #2D0A0F;
          outline: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .royal-input::placeholder {
          color: rgba(93, 22, 22, 0.5);
        }
        
        .royal-input:focus {
          border-color: #C8A951;
          background: #FFF8E1;
          box-shadow: 0 0 0 4px rgba(200, 169, 81, 0.1), 0 10px 25px rgba(200, 169, 81, 0.15);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
