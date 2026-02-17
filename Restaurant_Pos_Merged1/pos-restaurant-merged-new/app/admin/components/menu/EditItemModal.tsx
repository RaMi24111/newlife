"use client";

import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { useMenu } from '../../contexts/MenuContext';
import { MenuItem, UpdateMenuItemRequest } from '../../lib/menu.service';

interface EditItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MenuItem | null;
}

// Utility function to convert Google Drive links to direct image URLs
const convertGoogleDriveLink = (url: string): string => {
    if (!url) return url;

    // Pattern 1: https://drive.google.com/file/d/FILE_ID/view
    const pattern1 = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;

    // Pattern 2: https://drive.google.com/open?id=FILE_ID
    const pattern2 = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;

    // Pattern 3: Already converted format
    const pattern3 = /drive\.google\.com\/uc\?/;

    let fileId = null;

    // Check if already in correct format
    if (pattern3.test(url)) {
        return url;
    }

    // Try pattern 1
    let match = url.match(pattern1);
    if (match && match[1]) {
        fileId = match[1];
    }

    // Try pattern 2 if pattern 1 didn't match
    if (!fileId) {
        match = url.match(pattern2);
        if (match && match[1]) {
            fileId = match[1];
        }
    }

    // If we found a file ID, convert to direct link
    if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    return url;
};

export default function EditItemModal({ isOpen, onClose, item }: EditItemModalProps) {
    const { categories, updateMenuItem } = useMenu();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState<UpdateMenuItemRequest>({});

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                description: item.description || '',
                price: item.price,
                category_id: item.category_id,
                is_available: item.is_available,
                image_url: item.image_url || '',
                preparation_time: item.preparation_time,
            });
            setImagePreview(item.image_url || '');
        }
    }, [item]);

    const handleImageUrlChange = (url: string) => {
        const convertedUrl = convertGoogleDriveLink(url);
        setFormData({ ...formData, image_url: convertedUrl });
        setImagePreview(convertedUrl);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!item || !formData.name?.trim() || !formData.category_id || (formData.price && formData.price <= 0)) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateMenuItem(item.id, {
                ...formData,
                description: formData.description || undefined,
                image_url: formData.image_url || undefined,
                preparation_time: formData.preparation_time || undefined,
            });

            onClose();
        } catch (error: any) {
            alert(error.message || 'Failed to update menu item');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-bold text-text-primary">
                        Edit Menu Item
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
                            value={formData.name || ''}
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
                            value={formData.description || ''}
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
                                Price (₹) *
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
                                value={formData.category_id || ''}
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
                            type="text"
                            value={formData.image_url || ''}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            placeholder="Paste Google Drive link or direct image URL"
                        />
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-800 mb-2">
                                <span className="font-semibold">💡 How to add images:</span>
                            </p>

                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs font-semibold text-blue-800 mb-1">Option 1: Google Drive</p>
                                    <ol className="text-xs text-blue-700 space-y-1 ml-4 list-decimal">
                                        <li>Upload image to Google Drive</li>
                                        <li>Right-click → Share → "Anyone with the link can view"</li>
                                        <li>Copy and paste the share link here</li>
                                    </ol>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-blue-800 mb-1">Option 2: ImgBB (Recommended)</p>
                                    <ol className="text-xs text-blue-700 space-y-1 ml-4 list-decimal">
                                        <li>Go to <a href="https://imgbb.com" target="_blank" className="underline">imgbb.com</a></li>
                                        <li>Upload your image (no account needed)</li>
                                        <li>Copy the "Direct link" and paste here</li>
                                    </ol>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-blue-800 mb-1">Option 3: Imgur</p>
                                    <ol className="text-xs text-blue-700 space-y-1 ml-4 list-decimal">
                                        <li>Go to <a href="https://imgur.com" target="_blank" className="underline">imgur.com</a></li>
                                        <li>Upload image → Right-click → "Copy image address"</li>
                                        <li>Paste the link here</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                                    <ImageIcon size={16} />
                                    Image Preview
                                </p>
                                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={() => setImagePreview('')}
                                    />
                                </div>
                            </div>
                        )}
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
                            id="is_available_edit"
                            checked={formData.is_available || false}
                            onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                            className="w-5 h-5 text-ruby-red border-gray-300 rounded focus:ring-ruby-red"
                        />
                        <label htmlFor="is_available_edit" className="text-sm font-semibold text-text-primary">
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
