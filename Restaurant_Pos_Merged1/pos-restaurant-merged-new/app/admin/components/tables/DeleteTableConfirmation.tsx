"use client";

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Table } from '../../lib/tables.service';

interface DeleteTableConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    table: Table | null;
    isDeleting: boolean;
}

export default function DeleteTableConfirmation({
    isOpen,
    onClose,
    onConfirm,
    table,
    isDeleting,
}: DeleteTableConfirmationProps) {
    if (!isOpen || !table) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-red-600" size={24} />
                        <h2 className="text-xl font-serif font-bold text-red-900">
                            Delete Table
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        disabled={isDeleting}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-text-primary">
                        Are you sure you want to delete <strong>Table {table.table_number}</strong>?
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Warning:</strong> This action cannot be undone. The QR code for this table will no longer work.
                        </p>
                    </div>

                    {/* Table Details */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Table Number:</span>
                            <span className="font-semibold text-text-primary">{table.table_number}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Status:</span>
                            <span className="font-semibold text-text-primary">{table.table_status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">QR Token:</span>
                            <span className="font-mono text-xs text-text-primary">{table.qr_token.slice(0, 16)}...</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete Table'}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-6 py-3 bg-gray-200 text-text-primary rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
