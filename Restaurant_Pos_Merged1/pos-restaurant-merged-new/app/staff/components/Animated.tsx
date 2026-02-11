'use client';
import { motion, MotionProps, HTMLMotionProps } from 'framer-motion';
import React, { ReactNode } from 'react';

interface AnimatedProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'slideInRight';
}

export const Animated: React.FC<AnimatedProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.4,
  type = 'fadeIn',
  ...motionProps
}) => {
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    slideInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
    },
  };

  const selected = variants[type];
  const MotionDiv = motion.div as any;

  return (
    <MotionDiv
      className={className}
      initial={selected.initial}
      animate={selected.animate}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      {...motionProps}
    >
      {children}
    </MotionDiv>
  );
};
