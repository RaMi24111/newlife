"use client";

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WarningBannerProps {
    message?: string;
    dismissible?: boolean;
}

export default function WarningBanner({
    message = "Your restaurant is currently inactive. Please contact support to activate your account.",
    dismissible = true
}: WarningBannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 relative"
            >
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-amber-800">
                            {message}
                        </p>
                    </div>
                    {dismissible && (
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-auto flex-shrink-0 text-amber-500 hover:text-amber-700 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
