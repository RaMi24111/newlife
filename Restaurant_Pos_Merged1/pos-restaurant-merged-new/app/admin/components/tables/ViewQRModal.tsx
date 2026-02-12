"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Table } from '../../lib/tables.service';
import QRCodeDisplay from './QRCodeDisplay';

interface ViewQRModalProps {
    isOpen: boolean;
    onClose: () => void;
    table: Table | null;
}

export default function ViewQRModal({ isOpen, onClose, table }: ViewQRModalProps) {
    if (!isOpen || !table) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-serif font-bold text-text-primary">
                        QR Code - Table {table.table_number}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <QRCodeDisplay
                        qrToken={table.qr_token}
                        tableNumber={table.table_number}
                        size={320}
                        showDownload={true}
                        showCopy={true}
                    />
                </div>
            </div>
        </div>
    );
}
