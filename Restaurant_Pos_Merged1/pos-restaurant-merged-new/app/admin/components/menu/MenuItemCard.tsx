"use client";

import React from 'react';
import { Edit2, Clock, DollarSign } from 'lucide-react';
import { MenuItem } from '../../lib/menu.service';
import { useMenu } from '../../contexts/MenuContext';

interface MenuItemCardProps {
    item: MenuItem;
    categoryName?: string;
    onEdit: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, categoryName, onEdit }: MenuItemCardProps) {
    const { toggleItemAvailability } = useMenu();
    const [isToggling, setIsToggling] = React.useState(false);

    const handleToggle = async () => {
        setIsToggling(true);
        try {
            await toggleItemAvailability(item.id);
        } catch (error: any) {
            alert(error.message || 'Failed to toggle availability');
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
            {/* Image */}
            {item.image_url ? (
                <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="h-48 bg-gradient-to-br from-ruby-red/10 to-gold-start/10 flex items-center justify-center">
                    <DollarSign className="text-ruby-red/30" size={64} />
                </div>
            )}

            {/* Content */}
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-serif font-bold text-text-primary mb-1">
                            {item.name}
                        </h3>
                        {categoryName && (
                            <span className="text-xs text-text-muted bg-gray-100 px-2 py-1 rounded">
                                {categoryName}
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-ruby-red">
                            ₹{Number(item.price).toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Description */}
                {item.description && (
                    <p className="text-sm text-text-muted mb-4 line-clamp-2">
                        {item.description}
                    </p>
                )}

                {/* Preparation Time */}
                {item.preparation_time && (
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
                        <Clock size={16} />
                        <span>{item.preparation_time} mins</span>
                    </div>
                )}

                {/* Availability Toggle */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <span className="text-sm font-semibold text-text-primary">
                        Availability
                    </span>
                    <button
                        onClick={handleToggle}
                        disabled={isToggling}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.is_available ? 'bg-green-500' : 'bg-gray-300'
                            } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.is_available ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.is_available
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full mr-2 ${item.is_available ? 'bg-green-500' : 'bg-red-500'
                                }`}
                        ></span>
                        {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Edit2 size={16} />
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}
