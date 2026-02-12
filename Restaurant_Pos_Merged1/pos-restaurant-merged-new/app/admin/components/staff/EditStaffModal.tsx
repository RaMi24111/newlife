"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStaff } from '../../contexts/StaffContext';
import { StaffMember, StaffRole, UpdateStaffRequest } from '../../lib/staff.service';

interface EditStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    staff: StaffMember | null;
}

export default function EditStaffModal({ isOpen, onClose, staff }: EditStaffModalProps) {
    const { updateStaff } = useStaff();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<UpdateStaffRequest>({});

    useEffect(() => {
        if (staff) {
            setFormData({
                name: staff.name,
                role: staff.role,
                phone: staff.phone || '',
            });
        }
    }, [staff]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!staff || !formData.name?.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateStaff(staff.id, {
                ...formData,
                phone: formData.phone || undefined,
            });

            onClose();
        } catch (error: any) {
            alert(error.message || 'Failed to update staff member');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !staff) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-serif font-bold text-text-primary">
                        Edit Staff Member
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            placeholder="e.g., John Doe"
                            required
                        />
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={staff.email}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-text-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-text-muted mt-1">
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Role and Phone Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-2">
                                Role *
                            </label>
                            <select
                                value={formData.role || ''}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                required
                            >
                                <option value={StaffRole.SERVING_STAFF}>Serving Staff</option>
                                <option value={StaffRole.BILLING_STAFF}>Billing Staff</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-2">
                                Phone (Optional)
                            </label>
                            <input
                                type="tel"
                                value={formData.phone || ''}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Password cannot be changed here. Contact system administrator for password reset.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-colors font-semibold disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 text-text-primary rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
