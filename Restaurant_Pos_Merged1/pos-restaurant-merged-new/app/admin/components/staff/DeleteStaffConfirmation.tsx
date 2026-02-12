"use client";

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { StaffMember } from '../../lib/staff.service';

interface DeleteStaffConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    staff: StaffMember | null;
    isDeleting: boolean;
}

export default function DeleteStaffConfirmation({
    isOpen,
    onClose,
    onConfirm,
    staff,
    isDeleting
}: DeleteStaffConfirmationProps) {
    if (!isOpen || !staff) return null;

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
                            Delete Staff Member
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
                        Are you sure you want to delete this staff member? This action cannot be undone.
                    </p>

                    {/* Staff Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-text-muted">Name:</span>
                                <div className="font-semibold text-text-primary">{staff.name}</div>
                            </div>
                            <div>
                                <span className="text-sm text-text-muted">Email:</span>
                                <div className="text-text-primary">{staff.email}</div>
                            </div>
                            <div>
                                <span className="text-sm text-text-muted">Role:</span>
                                <div className="text-text-primary">
                                    {staff.role === 'SERVING_STAFF' ? 'Serving Staff' : 'Billing Staff'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>Warning:</strong> Deleting this staff member will remove their access to the system immediately.
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
