"use client";

import React from 'react';

interface StatusBadgeProps {
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const getStatusStyles = () => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 border border-green-300';
            case 'INACTIVE':
                return 'bg-red-100 text-red-800 border border-red-300';
            case 'SUSPENDED':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    const getDotColor = () => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-500';
            case 'INACTIVE':
                return 'bg-red-500';
            case 'SUSPENDED':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles()} ${className}`}
        >
            <span className={`w-2 h-2 rounded-full mr-2 ${getDotColor()}`}></span>
            {status}
        </span>
    );
}
