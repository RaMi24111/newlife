"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStaff } from '../../contexts/StaffContext';
import { StaffRole, CreateStaffRequest } from '../../lib/staff.service';

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultRole: StaffRole; // Role is passed from parent (billing/serving page)
}

export default function AddStaffModal({ isOpen, onClose, defaultRole }: AddStaffModalProps) {
    const { addStaff } = useStaff();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);
        try {
            await addStaff({
                name: formData.name,
                email: formData.email,
                password: 'AUTO_GENERATED', // Placeholder - backend will generate actual password
                role: defaultRole, // Use the role passed from parent
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
            });

            onClose();
        } catch (error: any) {
            alert(error.message || 'Failed to create staff member');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const roleLabel = defaultRole === StaffRole.BILLING_STAFF ? 'Billing' : 'Serving';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-serif font-bold text-text-primary">
                        Add New {roleLabel} Staff
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
                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Login password will be automatically generated based on the staff member's name and email.
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            placeholder="e.g., John Doe"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-colors font-semibold disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : `Create ${roleLabel} Staff`}
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
