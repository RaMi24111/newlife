"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useMenu } from '../../contexts/MenuContext';
import { CreateMenuItemRequest } from '../../lib/menu.service';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
    const { categories, addMenuItem } = useMenu();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CreateMenuItemRequest>({
        name: '',
        description: '',
        price: 0,
        category_id: '',
        is_available: true,
        image_url: '',
        preparation_time: undefined,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.category_id || formData.price <= 0) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await addMenuItem({
                ...formData,
                description: formData.description || undefined,
                image_url: formData.image_url || undefined,
                preparation_time: formData.preparation_time || undefined,
            });

            // Reset form
            setFormData({
                name: '',
                description: '',
                price: 0,
                category_id: '',
                is_available: true,
                image_url: '',
                preparation_time: undefined,
            });

            onClose();
        } catch (error: any) {
            alert(error.message || 'Failed to create menu item');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-bold text-text-primary">
                        Add New Menu Item
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
                    {/* Item Name */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                            Item Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            placeholder="e.g., Margherita Pizza"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            placeholder="Brief description of the item"
                            rows={3}
                        />
                    </div>

                    {/* Price and Category Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-2">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price || ''}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                            Image URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Preparation Time */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">
                            Preparation Time (minutes)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.preparation_time || ''}
                            onChange={(e) => setFormData({ ...formData, preparation_time: parseInt(e.target.value) || undefined })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            placeholder="e.g., 15"
                        />
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_available"
                            checked={formData.is_available}
                            onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                            className="w-5 h-5 text-ruby-red border-gray-300 rounded focus:ring-ruby-red"
                        />
                        <label htmlFor="is_available" className="text-sm font-semibold text-text-primary">
                            Available for ordering
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-colors font-semibold disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Item'}
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
