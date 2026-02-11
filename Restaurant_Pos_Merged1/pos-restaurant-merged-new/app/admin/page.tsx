'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RestaurantLanding() {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev: Array<{ x: number; y: number; id: number }>) => prev.filter((r: { id: number }) => r.id !== newRipple.id));
    }, 600);
  };

  // Floating particles configuration
  const particles = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: 15 + Math.random() * 10,
    delay: Math.random() * 5,
    size: 2 + Math.random() * 4,
  })), []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        {/* You can replace this with an actual food image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/background.jpg')",
          }}

        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

        {/* Maroon tint overlay */}
        <div className="absolute inset-0 bg-maroon/20 mix-blend-multiply" />

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-maroon-dark/30 via-transparent to-gold/20"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating particles/herbs effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle: { id: number; initialX: number; initialY: number; duration: number; delay: number; size: number }) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.initialX}%`,
              top: `${particle.initialY}%`,
            }}
            animate={{
              y: [0, -150, -300],
              x: [0, Math.sin(particle.id) * 30, Math.sin(particle.id * 2) * 60],
              opacity: [0, 0.7, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Herb-like shapes */}
            <div
              className="bg-gradient-to-br from-green-400/40 to-green-600/40 rounded-full blur-sm"
              style={{
                width: particle.size * 3,
                height: particle.size * 6,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-4xl mx-auto">

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-gold text-base sm:text-lg md:text-xl mb-4 tracking-wide font-light"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            When Flavours meet Passion, Magic happens.
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-8 sm:mb-12 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Come Join Us For A{' '}
            <span className="block mt-2">
              <motion.span
                className="inline-block"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(212, 175, 55, 0.5)',
                    '0 0 40px rgba(212, 175, 55, 0.8)',
                    '0 0 20px rgba(212, 175, 55, 0.5)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Magical Experience.
              </motion.span>
            </span>
          </motion.h1>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <Link href="/login/admin">
              <motion.button
                className="relative bg-gradient-to-r from-gold via-[#C9A66B] to-gold text-white font-semibold text-base sm:text-lg md:text-xl py-4 sm:py-5 px-10 sm:px-14 md:px-16 rounded-sm shadow-2xl shadow-gold/50 overflow-hidden group uppercase tracking-wider"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 30px 60px -12px rgba(212, 175, 55, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
              >
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: isHovered ? "200%" : "-100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {/* Glow pulse effect */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Ripple effects */}
                {ripples.map((ripple: { id: number; x: number; y: number }) => (
                  <motion.span
                    key={ripple.id}
                    className="absolute bg-white/40 rounded-full pointer-events-none"
                    initial={{ width: 0, height: 0, opacity: 1 }}
                    animate={{ width: 400, height: 400, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      left: ripple.x - 200,
                      top: ripple.y - 200,
                    }}
                  />
                ))}

                {/* Button text */}
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Get Started
                </span>

                {/* Bottom border highlight */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </motion.div>


        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800&display=swap');
        
        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
