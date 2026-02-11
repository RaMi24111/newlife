"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <RoyalLoader />;

  const handleContinue = () => {
    router.push("/customer/details");
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

      {/* RIGHT SLAB - Full width on mobile, half on desktop */}
      <div
        className="relative flex w-full lg:w-1/2 items-center justify-center px-4 sm:px-6 lg:px-12 py-8"
        style={{
          backgroundImage: "url('/images/pattern.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "420px",
        }}
      >
        <div className="absolute inset-0 bg-[#1A0505]/40" />
        
        {/* Maroon slab with elegant entrance animation */}
        <div className="relative z-10 w-full max-w-md p-8 sm:p-10 lg:p-12 rounded-2xl bg-gradient-to-br from-[#5D1616]/95 via-[#7B1F1F]/95 to-[#5D1616]/95 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-[#C8A951]/30 overflow-hidden animate-fade-in-up">
          
          {/* Subtle shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFD700]/5 to-transparent animate-shimmer-slow" />
          
          {/* Ornamental corner decorations */}
          <svg className="absolute top-4 left-4 w-6 h-6 sm:w-8 sm:h-8 text-[#C8A951]/40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          <svg className="absolute top-4 right-4 w-6 h-6 sm:w-8 sm:h-8 text-[#C8A951]/40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          
          {/* Crown icon */}
          <div className="flex justify-center mb-4 sm:mb-6 animate-float">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
            </svg>
          </div>

          {/* WELCOME Heading */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FFF8E1] mb-2 tracking-wide animate-text-glow" style={{ fontFamily: "'Playfair Display', serif" }}>
            WELCOME
          </h1>

          {/* Elegant divider */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="h-px w-10 sm:w-12 bg-gradient-to-r from-transparent to-[#C8A951]" />
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <div className="h-px w-10 sm:w-12 bg-gradient-to-l from-transparent to-[#C8A951]" />
          </div>

          {/* Subtext */}
          <p className="text-center text-[#E8DCC8] mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed px-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your journey to exquisite dining begins here
          </p>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="group relative w-full rounded-xl bg-gradient-to-r from-[#C8A951] via-[#D4B76E] to-[#C8A951] text-[#2D0A0F] font-bold py-3 sm:py-4 text-base sm:text-lg overflow-hidden shadow-[0_10px_30px_rgba(200,169,81,0.3)] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(200,169,81,0.5)] hover:scale-[1.02]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              BEGIN YOUR EXPERIENCE
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          </button>

          {/* Bottom ornament */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <svg className="w-20 sm:w-24 h-3 text-[#C8A951]/30" viewBox="0 0 100 10" fill="currentColor">
              <circle cx="10" cy="5" r="2"/>
              <circle cx="30" cy="5" r="2"/>
              <circle cx="50" cy="5" r="2"/>
              <circle cx="70" cy="5" r="2"/>
              <circle cx="90" cy="5" r="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* GLOBAL ANIMATIONS */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Cormorant+Garamond:wght@400;600&family=Poppins:wght@600&display=swap');

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(200,169,81,0.3), 0 0 40px rgba(200,169,81,0.1); }
          50% { text-shadow: 0 0 30px rgba(200,169,81,0.5), 0 0 60px rgba(200,169,81,0.2); }
        }
        .animate-text-glow { animation: text-glow 3s ease-in-out infinite; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }

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
      `}</style>
    </div>
  );
}

/* ===== ROYAL LOADER COMPONENT ===== */
function RoyalLoader() {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const loadingSteps = [
    { text: "Preparing your royal experience..." },
    { text: "Curating flavors and elegance..." },
    { text: "Almost ready for your journey..." }
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 2));
    }, 50);

    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % loadingSteps.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#FBF6EE]">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-8 animate-pattern-move"
        style={{ backgroundImage: "url('/images/pattern.jpg')", backgroundSize: "420px" }}
      />

      {/* Royal Loader Card */}
      <div className="relative z-10 w-[90%] max-w-[320px] rounded-2xl bg-gradient-to-br from-[#5D1616]/95 via-[#7B1F1F]/95 to-[#5D1616]/95 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-[#C8A951]/30 p-8 sm:p-10 animate-scale-in">
        
        {/* Crown loader icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#C8A951] animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" className="opacity-25"/>
              <path d="M12 2a10 10 0 0 1 10 10" className="opacity-75"/>
            </svg>
            <svg className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" opacity="0.6"/>
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <p className="text-center text-[#E8DCC8] font-medium text-base sm:text-lg mb-6 animate-fade-in-out px-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {loadingSteps[textIndex].text}
        </p>

        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-[#2D0A0F]/50 rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-[#C8A951] via-[#D4B76E] to-[#C8A951] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-progress"/>
        </div>

        {/* Progress percentage */}
        <p className="text-center text-[#C8A951] font-semibold text-sm mt-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {progress}%
        </p>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Poppins:wght@600&display=swap');

        @keyframes pattern-move { 
          0% { background-position: 0 0; } 
          100% { background-position: 420px 420px; } 
        }
        .animate-pattern-move { animation: pattern-move 30s linear infinite; }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 2s linear infinite; }

        @keyframes fade-in-out {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-fade-in-out { animation: fade-in-out 2s ease-in-out infinite; }

        @keyframes shimmer-progress { 
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer-progress { animation: shimmer-progress 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
