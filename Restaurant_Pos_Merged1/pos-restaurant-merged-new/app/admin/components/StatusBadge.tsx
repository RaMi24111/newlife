"use client";

import React from 'react';

interface StatusBadgeProps {
    status: 'ACTIVE' | 'INACTIVE';
    className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const isActive = status === 'ACTIVE';

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isActive
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                } ${className}`}
        >
            <span
                className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'
                    }`}
            ></span>
            {status}
        </span>
    );
}
