"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Utensils } from 'lucide-react';
import { Button } from '@/app/admin/components/ui/Button';
import { Input } from '@/app/admin/components/ui/Input';
import { DashboardHeader } from '@/app/admin/components/ui/DashboardHeader';

interface MenuItem {
    id: number;
    name: string;
    price: number | string;
    description?: string;
    image?: string;
    category: string;
    available?: boolean;
}

interface FormData {
    name: string;
    price: string;
    description: string;
    image: string;
    category: string;
}

export default function MenuPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Beverages");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<FormData>({ name: '', price: '', description: '', image: '', category: 'Beverages' });
    const [editId, setEditId] = useState<number | null>(null);

    const categories = ["Beverages", "Veg", "Non-Veg", "Today's Special"];

    const fetchItems = React.useCallback(() => {
        // Mock menu items - initialize state directly
        const mockItems: MenuItem[] = [
            { id: 1, name: 'Cappuccino', price: 120, description: 'Rich espresso with steamed milk', category: 'Beverages', available: true },
            { id: 2, name: 'Paneer Tikka', price: 280, description: 'Grilled cottage cheese with spices', category: 'Veg', available: true },
            { id: 3, name: 'Butter Chicken', price: 350, description: 'Tender chicken in creamy tomato sauce', category: 'Non-Veg', available: true },
        ];
        setItems(mockItems);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('=== ADD ITEM DEBUG ===');
        console.log('Form Data:', formData);
        console.log('Current Items:', items);
        console.log('Edit ID:', editId);

        if (editId) {
            // Update existing item
            const updatedItems = items.map(item =>
                item.id === editId
                    ? { ...item, ...formData, price: parseFloat(formData.price) }
                    : item
            );
            console.log('Updated Items:', updatedItems);
            setItems(updatedItems);
        } else {
            // Add new item
            const newItem: MenuItem = {
                id: Date.now(),
                ...formData,
                price: parseFloat(formData.price),
                available: true
            };
            console.log('New Item:', newItem);
            const updatedItems = [...items, newItem];
            console.log('Items after add:', updatedItems);
            setItems(updatedItems);
        }

        setShowModal(false);
        setEditId(null);
        setFormData({ name: '', price: '', description: '', image: '', category: activeCategory });
    };

    const handleEdit = (item: MenuItem) => {
        setFormData({
            name: item.name,
            price: item.price.toString(),
            description: item.description || '',
            image: item.image || '',
            category: item.category
        });
        setEditId(item.id);
        setActiveCategory(item.category);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm("Are you sure?")) return;
        setItems(items.filter(item => item.id !== id));
    };

    const filteredItems = items.filter(item => {
        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalize(item.category) === normalize(activeCategory);
    });

    return (
        <div className="min-h-screen bg-paper-white text-text-dark p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <DashboardHeader
                    title="Menu Management"
                    subtitle="Curate your dining offerings."
                    showBackButton={true}
                />

                <div className="flex justify-end mb-4">
                    <Button onClick={() => { setEditId(null); setFormData({ name: '', price: '', description: '', image: '', category: activeCategory }); setShowModal(true); }} className="bg-ruby-red text-white hover:bg-ruby-red/90 shadow-lg">
                        <Plus size={20} className="mr-2" /> Add Item
                    </Button>
                </div>

                {/* Categories Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all font-semibold ${activeCategory === cat ? 'bg-ruby-red text-gold-end shadow-md' : 'bg-card-white text-text-muted hover:bg-white hover:text-ruby-red'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p>Loading menu...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-card-white rounded-xl shadow-md border border-gold-start/10 overflow-hidden group hover:shadow-xl hover:border-gold-start/30 transition-all"
                                >
                                    <div className="h-48 relative overflow-hidden bg-paper-white">
                                        {item.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-text-muted/30">
                                                <Utensils size={40} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-1 rounded-lg backdrop-blur-sm">
                                            <button onClick={() => handleEdit(item)} className="p-1 text-white hover:text-gold-end"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1 text-white hover:text-red-400"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-ruby-red line-clamp-1">{item.name}</h3>
                                            <span className="font-bold text-text-dark bg-gold-start/20 px-2 py-0.5 rounded text-sm">₹{item.price}</span>
                                        </div>
                                        <p className="text-text-muted text-sm line-clamp-2 h-10">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredItems.length === 0 && (
                            <div className="col-span-full text-center py-12 text-text-muted/40">
                                No items in {activeCategory}. Add one to get started.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-card-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gold-start/30"
                        >
                            <h2 className="text-2xl font-bold text-ruby-red mb-6">{editId ? 'Edit Item' : 'Add New Item'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input placeholder="Item Name" value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} required className="bg-paper-white border-gold-start/20" />
                                <div className="flex gap-4">
                                    <Input type="number" placeholder="Price (₹)" value={formData.price} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })} required className="bg-paper-white border-gold-start/20" />
                                    <select
                                        value={formData.category}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full rounded-md border border-gold-start/20 bg-paper-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ruby-red/20"
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-md border border-gold-start/20 bg-paper-white px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ruby-red/20"
                                />
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase">Image Source</label>
                                    <Input
                                        placeholder="Image URL (e.g. Google Drive Link or Direct URL)"
                                        value={formData.image}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, image: e.target.value })}
                                        className="bg-paper-white border-gold-start/20"
                                    />
                                    <p className="text-xs text-text-muted">
                                        Tip: Use <a href="https://drive.google.com/drive/folders/1Wk_CQeZw5dMv0ndYBah2Tp_aIj0Wi-xt?usp=sharing" target="_blank" rel="noreferrer" className="underline text-ruby-red">Google Drive</a> for hosting.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="text-text-muted hover:bg-gray-100">Cancel</Button>
                                    <Button type="submit" className="bg-ruby-red text-white hover:bg-ruby-red/90">{editId ? 'Update' : 'Create'}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
