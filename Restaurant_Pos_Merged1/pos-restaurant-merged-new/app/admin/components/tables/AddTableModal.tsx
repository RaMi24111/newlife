"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTables } from '../../contexts/TablesContext';
import { CreateTableRequest } from '../../lib/tables.service';
import QRCodeDisplay from './QRCodeDisplay';

interface AddTableModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddTableModal({ isOpen, onClose }: AddTableModalProps) {
    const { addTable } = useTables();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tableNumber, setTableNumber] = useState('');
    const [createdTable, setCreatedTable] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tableNumber.trim()) {
            alert('Please enter a table number');
            return;
        }

        setIsSubmitting(true);
        try {
            const newTable = await addTable({ table_number: tableNumber });
            setCreatedTable(newTable);
            setShowSuccess(true);
            setTableNumber('');
        } catch (error: any) {
            alert(error.message || 'Failed to create table');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowSuccess(false);
        setCreatedTable(null);
        setTableNumber('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-serif font-bold text-text-primary">
                        {showSuccess ? 'Table Created Successfully!' : 'Add New Table'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!showSuccess ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Info Note */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> A unique QR code will be automatically generated for this table. Customers can scan it to place orders.
                                </p>
                            </div>

                            {/* Table Number */}
                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-2">
                                    Table Number *
                                </label>
                                <input
                                    type="text"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                    placeholder="e.g., T1, Table 5, A-12"
                                    required
                                />
                                <p className="text-xs text-text-muted mt-1">
                                    Enter a unique identifier for this table
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-colors font-semibold disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Table'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-6 py-3 bg-gray-200 text-text-primary rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {/* Success Message */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <p className="text-green-800 font-semibold">
                                    Table "{createdTable?.table_number}" has been created successfully!
                                </p>
                            </div>

                            {/* QR Code Display */}
                            {createdTable && (
                                <QRCodeDisplay
                                    qrToken={createdTable.qr_token}
                                    tableNumber={createdTable.table_number}
                                    size={256}
                                    showDownload={true}
                                    showCopy={true}
                                />
                            )}

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="w-full px-6 py-3 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-colors font-semibold"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
