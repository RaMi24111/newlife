"use client";

import React, { useState, useMemo } from 'react';
import { Plus, Search, Grid, List } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { MenuProvider, useMenu } from '../../contexts/MenuContext';
import CategoryManager from '../../components/menu/CategoryManager';
import MenuItemCard from '../../components/menu/MenuItemCard';
import AddItemModal from '../../components/menu/AddItemModal';
import EditItemModal from '../../components/menu/EditItemModal';
import { MenuItem } from '../../lib/menu.service';

function MenuManagementContent() {
    const { categories, menuItems, isLoading, error } = useMenu();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Filter menu items
    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
            const matchesSearch = !searchQuery ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [menuItems, selectedCategory, searchQuery]);

    const handleEdit = (item: MenuItem) => {
        setSelectedItem(item);
        setShowEditModal(true);
    };



    const getCategoryName = (categoryId: string) => {
        return categories.find(c => c.id === categoryId)?.name || 'Unknown';
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-paper-white">
                {/* Header */}
                <header className="bg-ruby-red py-8 px-8 shadow-lg border-b-4 border-gold-start">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/admin/dashboard" className="text-gold-start hover:text-white transition-colors mb-4 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-serif font-bold text-white mb-2">
                                    Menu Management
                                </h1>
                                <p className="text-gold-start/80">Manage your restaurant menu items and categories</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gold-start text-ruby-red rounded-lg hover:bg-gold-end transition-colors font-semibold shadow-lg"
                            >
                                <Plus size={20} />
                                Add Menu Item
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar - Categories */}
                        <div className="lg:col-span-1">
                            <CategoryManager
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />
                        </div>

                        {/* Main Content - Menu Items */}
                        <div className="lg:col-span-3">
                            {/* Search and View Controls */}
                            <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search menu items..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-ruby-red text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                                                }`}
                                        >
                                            <Grid size={20} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-ruby-red text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'
                                                }`}
                                        >
                                            <List size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Items Count */}
                            <div className="mb-4">
                                <p className="text-text-muted">
                                    Showing <span className="font-semibold text-text-primary">{filteredItems.length}</span> item{filteredItems.length !== 1 ? 's' : ''}
                                    {selectedCategory && ` in ${getCategoryName(selectedCategory)}`}
                                </p>
                            </div>

                            {/* Menu Items Grid/List */}
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                                            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                                    <div className="text-gray-300 mb-4">
                                        <Plus size={64} className="mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                                        No menu items found
                                    </h3>
                                    <p className="text-text-muted mb-6">
                                        {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first menu item'}
                                    </p>
                                    {!searchQuery && (
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="px-6 py-3 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-colors font-semibold"
                                        >
                                            Add Menu Item
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className={viewMode === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                    : 'space-y-4'
                                }>
                                    {filteredItems.map(item => (
                                        <MenuItemCard
                                            key={item.id}
                                            item={item}
                                            categoryName={getCategoryName(item.category_id)}
                                            onEdit={handleEdit}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
            <EditItemModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} item={selectedItem} />

        </ProtectedRoute>
    );
}

export default function MenuManagementPage() {
    return (
        <MenuProvider>
            <MenuManagementContent />
        </MenuProvider>
    );
}
