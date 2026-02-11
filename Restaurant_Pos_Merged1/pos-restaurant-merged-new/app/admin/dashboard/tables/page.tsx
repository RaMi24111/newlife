"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent, MouseEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/admin/components/ui/Button';
import { Input } from '@/app/admin/components/ui/Input';
import { DashboardHeader } from '@/app/admin/components/ui/DashboardHeader';
import { Trash2, Settings, X, CheckCircle } from 'lucide-react';

interface Table {
    id: number;
    tableNo: number;
    status: string;
    capacity: number;
    qrCode: string;
}

export default function TablesPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [setupCount, setSetupCount] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);

    const fetchTables = React.useCallback(async () => {
        // Mock data - no API call
        try {
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock tables
            const mockTables: Table[] = [
                { id: 1, tableNo: 1, status: 'Empty', capacity: 4, qrCode: '/next.svg' },
                { id: 2, tableNo: 2, status: 'Occupied', capacity: 2, qrCode: '/next.svg' },
                { id: 3, tableNo: 3, status: 'Empty', capacity: 6, qrCode: '/next.svg' },
            ];
            setTables(mockTables);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTables();

        const hasPrompted = sessionStorage.getItem('tables_prompted');
        if (!hasPrompted) {
            setShowPrompt(true);
        }
    }, [fetchTables]);

    const handleSetup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!setupCount || parseInt(setupCount) < 1) return;

        // Mock setup - no API call
        try {
            setLoading(true);
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const count = parseInt(setupCount);
            const newTables: Table[] = Array.from({ length: count }, (_, i) => ({
                id: i + 1,
                tableNo: i + 1,
                status: 'Empty',
                capacity: 4,
                qrCode: '/next.svg'
            }));

            setTables(newTables);
            setShowPrompt(false);
            sessionStorage.setItem('tables_prompted', 'true');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const closePrompt = () => {
        setShowPrompt(false);
        sessionStorage.setItem('tables_prompted', 'true');
    };

    const toggleStatus = async (table: Table) => {
        const newStatus = table.status === 'Occupied' ? 'Empty' : 'Occupied';

        // Mock toggle - no API call
        try {
            // Simulate brief delay
            await new Promise(resolve => setTimeout(resolve, 200));

            setTables(tables.map(t =>
                t.id === table.id
                    ? { ...t, status: newStatus }
                    : t
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const addTable = async () => {
        const nextNo = tables.length > 0 ? tables[tables.length - 1].tableNo + 1 : 1;

        // Mock add - no API call
        try {
            // Simulate brief delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const newTable: Table = {
                id: Date.now(),
                tableNo: nextNo,
                status: 'Empty',
                capacity: 4,
                qrCode: '/next.svg'
            };

            setTables([...tables, newTable]);
        } catch (err) {
            console.error(err);
        }
    };

    const removeTable = async (id: number) => {
        if (!confirm('Remove this table?')) return;

        // Mock remove - no API call
        try {
            // Simulate brief delay
            await new Promise(resolve => setTimeout(resolve, 200));
            setTables(tables.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-paper-white text-text-dark p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <DashboardHeader
                    title="Table Details"
                    showBackButton={true}
                />

                <div className="flex justify-end mb-4">
                    <Button onClick={() => setShowPrompt(true)} variant="outline" className="flex items-center gap-2 border-gold-start text-ruby-red hover:bg-gold-start/10">
                        <Settings size={18} /> Configure Count
                    </Button>
                </div>

                {loading ? (
                    <p>Loading tables...</p>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-text-muted">Manage table status and QR codes.</p>
                            <Button onClick={addTable} variant="outline" className="flex items-center gap-2 border-gold-start/50 text-ruby-red hover:bg-gold-start/10"><CheckCircle size={16} /> Add Table</Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {tables.map((table) => (
                                <motion.div
                                    key={table.id}
                                    layout
                                    className={`relative p-6 rounded-xl border flex flex-col items-center justify-center gap-4 transition-all shadow-sm ${table.status === 'Occupied' ? 'bg-ruby-red border-ruby-red text-white' : 'bg-card-white border-gold-start/30 text-text-dark hover:border-gold-start hover:shadow-lg'}`}
                                >
                                    <div className="absolute top-2 right-2 z-10">
                                        <button onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); removeTable(table.id); }} className={`p-1 rounded transition-colors ${table.status === 'Occupied' ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-text-muted hover:text-red-500 hover:bg-red-50'}`}><Trash2 size={16} /></button>
                                    </div>

                                    <div className={`text-3xl font-bold font-serif ${table.status === 'Occupied' ? 'text-gold-end' : 'text-ruby-red'}`}>
                                        {table.tableNo}
                                    </div>

                                    <div
                                        onClick={(e: MouseEvent<HTMLDivElement>) => { e.stopPropagation(); toggleStatus(table); }}
                                        className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full transition-colors ${table.status === 'Occupied' ? 'bg-black/20 text-white' : 'bg-paper-white text-text-muted hover:bg-paper-white/80'}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${table.status === 'Occupied' ? 'bg-gold-end' : 'bg-text-muted'}`}></div>
                                        <span className="text-xs uppercase tracking-widest font-bold">{table.status}</span>
                                    </div>

                                    <div className="mt-2 bg-white p-2 rounded shadow-inner">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={table.qrCode} alt={`QR Table ${table.tableNo}`} className="w-16 h-16" />
                                    </div>
                                    <a href={table.qrCode} download={`table-${table.tableNo}-qr.png`} className={`text-xs underline opacity-60 hover:opacity-100 ${table.status === 'Occupied' ? 'text-white' : 'text-ruby-red'}`}>Download QR</a>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-card-white border border-gold-start rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
                        >
                            <button onClick={closePrompt} className="absolute top-4 right-4 text-text-muted hover:text-ruby-red">
                                <X size={24} />
                            </button>
                            <h2 className="text-3xl font-bold text-ruby-red mb-4 font-serif text-center">Setup Tables</h2>
                            <p className="text-center text-text-muted mb-8">How many tables are in your restaurant?</p>

                            <form onSubmit={handleSetup} className="space-y-6">
                                <Input
                                    placeholder="Number of tables (e.g. 15)"
                                    type="number"
                                    value={setupCount}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSetupCount(e.target.value)}
                                    required
                                    min="1"
                                    className="text-center text-lg bg-paper-white border-gold-start/30 focus:border-ruby-red"
                                />
                                <div className="flex gap-4">
                                    <Button type="submit" className="flex-1 bg-ruby-red text-white font-bold hover:bg-ruby-red/90 shadow-lg">Initialize</Button>
                                    <Button type="button" variant="outline" onClick={closePrompt} className="flex-1 border-gray-200 text-text-muted hover:bg-gray-50">Skip</Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
