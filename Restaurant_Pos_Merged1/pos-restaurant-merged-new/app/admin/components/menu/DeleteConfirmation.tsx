"use client";

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { MenuItem } from '../../lib/menu.service';

interface DeleteConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    item: MenuItem | null;
    isDeleting: boolean;
}

export default function DeleteConfirmation({
    isOpen,
    onClose,
    onConfirm,
    item,
    isDeleting
}: DeleteConfirmationProps) {
    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                            <AlertTriangle className="text-red-600" size={24} />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-red-900">
                            Delete Menu Item
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        disabled={isDeleting}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-text-primary mb-4">
                        Are you sure you want to delete this menu item? This action cannot be undone.
                    </p>

                    {/* Item Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-text-primary">{item.name}</h3>
                                {item.description && (
                                    <p className="text-sm text-text-muted mt-1">{item.description}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-ruby-red">${Number(item.price).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>Warning:</strong> Deleting this item will remove it from all active orders and cannot be recovered.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-3 bg-gray-200 text-text-primary rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
