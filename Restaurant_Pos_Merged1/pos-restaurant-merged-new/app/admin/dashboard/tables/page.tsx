"use client";

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { TablesProvider, useTables } from '../../contexts/TablesContext';
import TablesTable from '../../components/tables/TablesTable';
import AddTableModal from '../../components/tables/AddTableModal';
import DeleteTableConfirmation from '../../components/tables/DeleteTableConfirmation';
import ViewQRModal from '../../components/tables/ViewQRModal';
import { Table, TableStatus } from '../../lib/tables.service';

function TablesManagementContent() {
    const { tables, isLoading, error, deleteTable } = useTables();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<TableStatus | 'ALL'>('ALL');
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter tables
    const filteredTables = useMemo(() => {
        return tables.filter(table => {
            const matchesSearch = !searchQuery ||
                table.table_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                table.qr_token.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || table.table_status === statusFilter;

            const matchesActive = activeFilter === 'ALL' ||
                (activeFilter === 'ACTIVE' && table.is_active) ||
                (activeFilter === 'INACTIVE' && !table.is_active);

            return matchesSearch && matchesStatus && matchesActive;
        });
    }, [tables, searchQuery, statusFilter, activeFilter]);

    const handleDelete = (table: Table) => {
        setSelectedTable(table);
        setShowDeleteModal(true);
    };

    const handleViewQR = (table: Table) => {
        setSelectedTable(table);
        setShowQRModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedTable) return;

        setIsDeleting(true);
        try {
            await deleteTable(selectedTable.id);
            setShowDeleteModal(false);
            setSelectedTable(null);
        } catch (error: any) {
            alert(error.message || 'Failed to delete table');
        } finally {
            setIsDeleting(false);
        }
    };

    // Stats
    const stats = {
        total: tables.length,
        active: tables.filter(t => t.is_active).length,
        empty: tables.filter(t => t.table_status === TableStatus.EMPTY).length,
        occupied: tables.filter(t => t.table_status === TableStatus.OCCUPIED).length,
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-paper-white">
                {/* Header */}
                <header className="bg-ruby-red py-8 px-8 shadow-lg border-b-4 border-gold-start">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-semibold border border-white/30"
                            >
                                <ArrowLeft size={20} />
                                Back to Dashboard
                            </Link>
                            <div className="text-center">
                                <h1 className="text-4xl font-serif font-bold text-white mb-2">
                                    Tables Management
                                </h1>
                                <p className="text-gold-start/80">Manage restaurant tables and QR codes</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gold-start text-ruby-red rounded-lg hover:bg-gold-end transition-colors font-semibold shadow-lg"
                            >
                                <Plus size={20} />
                                Add Table
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="text-text-muted text-sm mb-1">Total Tables</div>
                            <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="text-text-muted text-sm mb-1">Active</div>
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="text-text-muted text-sm mb-1">Empty</div>
                            <div className="text-2xl font-bold text-green-600">{stats.empty}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="text-text-muted text-sm mb-1">Occupied</div>
                            <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={20} className="text-text-muted" />
                            <h3 className="font-semibold text-text-primary">Filters</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by table number..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as TableStatus | 'ALL')}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            >
                                <option value="ALL">All Status</option>
                                <option value={TableStatus.EMPTY}>Empty</option>
                                <option value={TableStatus.OCCUPIED}>Occupied</option>
                            </select>

                            {/* Active Filter */}
                            <select
                                value={activeFilter}
                                onChange={(e) => setActiveFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            >
                                <option value="ALL">All Tables</option>
                                <option value="ACTIVE">Active Only</option>
                                <option value="INACTIVE">Inactive Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Tables Count */}
                    <div className="mb-4">
                        <p className="text-text-muted">
                            Showing <span className="font-semibold text-text-primary">{filteredTables.length}</span> table{filteredTables.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Tables Table */}
                    {isLoading ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    ) : (
                        <TablesTable
                            tables={filteredTables}
                            onDelete={handleDelete}
                            onViewQR={handleViewQR}
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddTableModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
            <ViewQRModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} table={selectedTable} />
            <DeleteTableConfirmation
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedTable(null);
                }}
                onConfirm={confirmDelete}
                table={selectedTable}
                isDeleting={isDeleting}
            />
        </ProtectedRoute>
    );
}

export default function TablesManagementPage() {
    return (
        <TablesProvider>
            <TablesManagementContent />
        </TablesProvider>
    );
}
