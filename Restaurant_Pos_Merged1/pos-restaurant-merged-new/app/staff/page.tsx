'use client';
import Link from 'next/link';
import { Icon } from './components/Icon';
import { Gradient } from './components/Gradient';
import { Animated } from './components/Animated';

export default function StaffLanding() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center relative overflow-hidden p-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-light"></div>

      {/* Animated Decorative Orbs */}
      <Animated type="fadeIn" delay={0.2} duration={1}>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
      </Animated>
      <Animated type="fadeIn" delay={0.4} duration={1}>
        <div className="absolute top-1/3 -left-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl"></div>
      </Animated>
      <Animated type="fadeIn" delay={0.6} duration={1}>
        <div className="absolute bottom-32 right-10 w-36 h-36 rounded-full bg-teal-500/10 blur-3xl"></div>
      </Animated>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-8 md:py-0 px-4">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[32px] md:rounded-[40px] p-6 md:p-12 w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          <div className="flex-1 text-center md:text-left w-full">
            {/* Logo Container */}
            <div className="inline-block mb-6 md:mb-8 relative">
                {/* Glow Effect */}
                <div className="absolute -inset-6 bg-primary/40 rounded-full blur-2xl"></div>

                {/* Logo */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center overflow-hidden shadow-glow mx-auto md:mx-0">
                  <Gradient
                    colors={['#8B1D1D', '#9B2B2B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                  >
                    <div />
                  </Gradient>
                  <Icon name="restaurant" size={48} className="md:hidden relative z-10 text-white" />
                  <Icon name="restaurant" size={64} className="hidden md:block relative z-10 text-white" />
                </div>
            </div>

            {/* Title Section */}
            <Animated type="fadeInUp" delay={0.3} duration={0.6} className="mb-6 md:mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight">
                RestaurantOS
              </h1>
              <p className="text-base md:text-xl text-slate-700 leading-relaxed font-medium px-4 md:px-0">
                The Complete Operating System for Fine Dining Service
              </p>
              <div className="inline-flex items-center mt-6 bg-white/80 border border-primary/10 px-4 py-2 md:px-6 md:py-3 rounded-full shadow-sm backdrop-blur-sm">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full mr-2 md:mr-3 animate-pulse"></div>
                <span className="text-primary text-xs md:text-base font-bold">System Online & Ready</span>
              </div>
            </Animated>
          </div>

          <div className="flex-1 w-full max-w-sm">
            {/* Features Grid */}
            <Animated type="fadeInUp" delay={0.5} duration={0.6} className="w-full mb-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: 'receipt-outline' as const, label: 'Order Mgmt', color: '#7B1F1F', delay: 0 },
                  { icon: 'grid-outline' as const, label: 'Table Status', color: '#f43f5e', delay: 0.1 },
                  { icon: 'wallet-outline' as const, label: 'Smart Billing', color: '#14b8a6', delay: 0.2 },
                  { icon: 'people-outline' as const, label: 'Staff Profile', color: '#6366f1', delay: 0.3 },
                ].map((item, index) => (
                  <Animated key={index} type="fadeInUp" delay={0.6 + item.delay} duration={0.4}>
                    <div className="bg-white/60 border border-white/50 rounded-2xl p-4 flex flex-col items-center hover:bg-white transition-colors">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Icon name={item.icon} size={20} color={item.color} />
                      </div>
                      <span className="text-slate-800 text-xs font-bold">{item.label}</span>
                    </div>
                  </Animated>
                ))}
              </div>
            </Animated>

            {/* Login Button */}
            <Animated type="fadeInUp" delay={0.8} duration={0.6} className="w-full">
              <Link href="/admin/login/admin">
                <button className="w-full overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <Gradient
                    colors={['#7B1F1F', '#9B2B2B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="w-full h-20 flex items-center justify-center"
                  >
                    <span className="text-white text-xl font-bold tracking-wide mr-3">
                      Staff Platform Login
                    </span>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon name="arrow-forward" size={20} color="white" />
                    </div>
                  </Gradient>
                </button>
              </Link>
            </Animated>

            {/* Version */}
            <Animated type="fadeIn" delay={1} duration={0.6} className="text-center mt-8">
              <p className="text-slate-500 text-sm font-medium">
                v2.5.0 • Enterprise Edition
              </p>
            </Animated>
          </div>
        </div>
      </div>
    </div>
  );
}
