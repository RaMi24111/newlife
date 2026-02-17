"use client";

import React, { useState } from 'react';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';
import { useMenu } from '../../contexts/MenuContext';

interface CategoryManagerProps {
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryManager({ selectedCategory, onSelectCategory }: CategoryManagerProps) {
    const { categories, addCategory, deleteCategory, isLoading } = useMenu();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        setIsSubmitting(true);
        try {
            await addCategory({
                name: newCategory.name,
                description: newCategory.description || undefined,
            });
            setNewCategory({ name: '', description: '' });
            setShowAddForm(false);
        } catch (error: any) {
            alert(error.message || 'Failed to create category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (categoryId: string, categoryName: string) => {
        if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingId(categoryId);
        try {
            await deleteCategory(categoryId);
            // If the deleted category was selected, reset to "All Items"
            if (selectedCategory === categoryId) {
                onSelectCategory(null);
            }
        } catch (error: any) {
            alert(error.message || 'Failed to delete category');
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="mb-4">
                <h2 className="text-xl font-serif font-bold text-text-primary flex items-center gap-2 mb-3">
                    <FolderOpen className="text-ruby-red" size={24} />
                    Categories
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-colors"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            {/* Add Category Form */}
            {showAddForm && (
                <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-1">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                placeholder="e.g., Appetizers, Main Course"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-1">
                                Description (Optional)
                            </label>
                            <input
                                type="text"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                placeholder="Brief description"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Category'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewCategory({ name: '', description: '' });
                                }}
                                className="px-4 py-2 bg-gray-200 text-text-primary rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Categories List */}
            <div className="space-y-2">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedCategory === null
                        ? 'bg-ruby-red text-white'
                        : 'bg-gray-50 text-text-primary hover:bg-gray-100'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">All Items</span>
                        <span className={`text-sm ${selectedCategory === null ? 'text-white/80' : 'text-text-muted'}`}>
                            View all
                        </span>
                    </div>
                </button>

                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`flex items-center gap-2 rounded-lg transition-colors ${selectedCategory === category.id
                            ? 'bg-ruby-red text-white'
                            : 'bg-gray-50 text-text-primary hover:bg-gray-100'
                            }`}
                    >
                        <button
                            onClick={() => onSelectCategory(category.id)}
                            className="flex-1 text-left px-4 py-3"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold">{category.name}</div>
                                    {category.description && (
                                        <div className={`text-sm ${selectedCategory === category.id ? 'text-white/80' : 'text-text-muted'}`}>
                                            {category.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(category.id, category.name);
                            }}
                            disabled={deletingId === category.id}
                            className={`px-3 py-3 mr-2 rounded-lg transition-colors ${selectedCategory === category.id
                                ? 'hover:bg-white/20 text-white'
                                : 'hover:bg-red-100 text-red-600'
                                } disabled:opacity-50`}
                            title="Delete category"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {categories.length === 0 && !showAddForm && (
                    <div className="text-center py-8 text-text-muted">
                        <FolderOpen className="mx-auto mb-2 text-gray-300" size={48} />
                        <p>No categories yet. Create one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Export selected category for parent component
export function useCategoryFilter() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    return { selectedCategory, setSelectedCategory };
}
