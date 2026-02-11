"use client";
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import React from 'react';
import { useParams } from 'next/navigation';

import { motion } from 'framer-motion';
import { Trash2, Edit2, Save, X, Receipt } from 'lucide-react';
import { Button } from '@/app/admin/components/ui/Button';
import { Input } from '@/app/admin/components/ui/Input';
import { DashboardHeader } from '@/app/admin/components/ui/DashboardHeader';

interface Staff {
    id: number;
    name: string;
    phone: string;
    username: string;
    role: string;
    tempPassword?: string;
}

interface NewStaffForm {
    name: string;
    phone: string;
}

interface EditStaffForm {
    name: string;
    phone: string;
}

export default function StaffList() {
    const params = useParams();
    const type = params.type as string;

    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [newStaff, setNewStaff] = useState<NewStaffForm>({ name: '', phone: '' });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<EditStaffForm>({ name: '', phone: '' });

    const fetchStaff = React.useCallback(async () => {
        // Mock data - no API call
        try {
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock staff data
            const mockStaff: Staff[] = [
                { id: 1, name: 'John Doe', phone: '9876543210', username: `${type.toUpperCase()}-001`, role: type },
                { id: 2, name: 'Jane Smith', phone: '9876543211', username: `${type.toUpperCase()}-002`, role: type },
            ];
            setStaffList(mockStaff);
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Mock add - no API call
        try {
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // Generate mock credentials
            const newId = Date.now();
            const username = `${type.toUpperCase()}-${String(staffList.length + 1).padStart(3, '0')}`;
            const tempPassword = Math.random().toString(36).slice(-8);

            const newStaffMember: Staff = {
                id: newId,
                ...newStaff,
                username,
                role: type,
                tempPassword
            };

            setStaffList([newStaffMember, ...staffList]);
            setNewStaff({ name: '', phone: '' });
        } catch (error) {
            console.error('Failed to add staff:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this staff member?")) return;
        try {
            // Mock delete - no API call
            await new Promise(resolve => setTimeout(resolve, 200));
            setStaffList(staffList.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete staff:', error);
        }
    };

    const startEdit = (staff: Staff) => {
        setEditingId(staff.id);
        setEditForm({ name: staff.name, phone: staff.phone });
    };

    const saveEdit = async () => {
        try {
            // Mock update - no API call
            await new Promise(resolve => setTimeout(resolve, 200));

            setStaffList(staffList.map(s =>
                s.id === editingId
                    ? { ...s, ...editForm }
                    : s
            ));
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update staff:", error);
        }
    };

    return (
        <div className="min-h-screen bg-paper-white text-text-dark p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <DashboardHeader
                    title={`${type.charAt(0).toUpperCase() + type.slice(1)} Staff`}
                    subtitle="Manage your team details and access permissions."
                    showBackButton={true}
                    backHref="/dashboard/staff"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Add New Staff Form */}
                    <div className="lg:col-span-4 h-fit sticky top-8">
                        <div className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gold-start/20">
                            <h2 className="text-2xl font-bold text-ruby-red mb-6 font-serif border-b border-gold-start/10 pb-4">Add New Member</h2>
                            <form onSubmit={handleAdd} className="space-y-6">
                                <Input
                                    placeholder="Full Name"
                                    value={newStaff.name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewStaff({ ...newStaff, name: e.target.value })}
                                    required
                                    className="bg-paper-white border-gold-start/20 focus:border-ruby-red h-12"
                                />
                                <Input
                                    placeholder="Phone Number"
                                    value={newStaff.phone}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewStaff({ ...newStaff, phone: e.target.value })}
                                    required
                                    className="bg-paper-white border-gold-start/20 focus:border-ruby-red h-12"
                                />
                                <Button type="submit" disabled={loading} className="w-full h-12 bg-linear-to-r from-ruby-red to-primary text-white font-bold tracking-wide hover:shadow-lg transition-all duration-300 rounded-xl">
                                    {loading ? 'Processing...' : 'Generate Credentials'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Staff List */}
                    <div className="lg:col-span-8">
                        <h2 className="text-2xl font-bold text-text-dark mb-6 font-serif">Existing Staff <span className="text-gold-start text-lg font-normal ml-2">({staffList.length})</span></h2>
                        <div className="space-y-4">
                            {staffList.map((staff) => (
                                <motion.div
                                    key={staff.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-black/5 hover:border-gold-start/50 hover:shadow-md transition-all duration-300 flex justify-between items-center group"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-ruby-red/5 flex items-center justify-center text-ruby-red font-bold text-xl font-serif shrink-0">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <div className="w-full">
                                            {editingId === staff.id ? (
                                                <div className="flex flex-col gap-2 w-full max-w-xs">
                                                    <Input
                                                        value={editForm.name}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="h-9 text-sm bg-white border-gold-start/30"
                                                        placeholder="Name"
                                                    />
                                                    <Input
                                                        value={editForm.phone}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, phone: e.target.value })}
                                                        className="h-9 text-sm bg-white border-gold-start/30"
                                                        placeholder="Phone"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="font-bold text-lg text-text-dark group-hover:text-ruby-red transition-colors">{staff.name}</p>
                                                    <p className="text-text-muted text-sm">{staff.phone}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-semibold text-gold-start bg-gold-start/10 px-2 py-0.5 rounded-full">ID: {staff.username}</span>
                                                        {staff.tempPassword && <span className="text-xs font-mono text-text-muted/70 bg-gray-100 px-2 py-0.5 rounded-full">Pass: {staff.tempPassword}</span>}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        {editingId === staff.id ? (
                                            <>
                                                <Button size="sm" onClick={saveEdit} className="bg-green-600 text-white hover:bg-green-700 h-9 w-9 p-0 rounded-full"><Save size={16} /></Button>
                                                <Button size="sm" onClick={() => setEditingId(null)} variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 h-9 w-9 p-0 rounded-full"><X size={16} /></Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button size="sm" onClick={() => startEdit(staff)} variant="ghost" className="text-accent hover:bg-accent/10 hover:text-ruby-red h-9 w-9 p-0 rounded-full"><Edit2 size={18} /></Button>
                                                <Button size="sm" onClick={() => handleDelete(staff.id)} variant="ghost" className="text-gray-400 hover:bg-red-50 hover:text-red-500 h-9 w-9 p-0 rounded-full"><Trash2 size={18} /></Button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {!loading && staffList.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                <div className="text-gold-start mb-4 opacity-50"><Receipt size={48} className="mx-auto" /></div>
                                <p className="text-text-muted text-lg font-serif italic">No staff members found.</p>
                                <p className="text-sm text-gray-400">Add a new member to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
