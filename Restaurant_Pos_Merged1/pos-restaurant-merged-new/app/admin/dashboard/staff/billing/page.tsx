"use client";

import React, { useState, useMemo } from 'react';
import { Search, UserPlus } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { StaffProvider, useStaff } from '../../../contexts/StaffContext';
import StaffTable from '../../../components/staff/StaffTable';
import AddStaffModal from '../../../components/staff/AddStaffModal';
import EditStaffModal from '../../../components/staff/EditStaffModal';
import DeleteStaffConfirmation from '../../../components/staff/DeleteStaffConfirmation';
import { StaffMember, StaffRole } from '../../../lib/staff.service';

function BillingStaffContent() {
    const { staff, isLoading, error, deleteStaff } = useStaff();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter billing staff only
    const billingStaff = useMemo(() => {
        return staff.filter(member => {
            const isBillingStaff = member.role === StaffRole.BILLING_STAFF;

            const matchesSearch = !searchQuery ||
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' ||
                (statusFilter === 'ACTIVE' && member.is_active) ||
                (statusFilter === 'INACTIVE' && !member.is_active);

            return isBillingStaff && matchesSearch && matchesStatus;
        });
    }, [staff, searchQuery, statusFilter]);

    const handleEdit = (member: StaffMember) => {
        setSelectedStaff(member);
        setShowEditModal(true);
    };

    const handleDelete = (member: StaffMember) => {
        setSelectedStaff(member);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedStaff) return;

        setIsDeleting(true);
        try {
            await deleteStaff(selectedStaff.id);
            setShowDeleteModal(false);
            setSelectedStaff(null);
        } catch (error: any) {
            alert(error.message || 'Failed to delete staff member');
        } finally {
            setIsDeleting(false);
        }
    };

    // Stats
    const stats = {
        total: billingStaff.length,
        active: billingStaff.filter(s => s.is_active).length,
        inactive: billingStaff.filter(s => !s.is_active).length,
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-paper-white">
                {/* Header */}
                <header className="bg-ruby-red py-8 px-8 shadow-lg border-b-4 border-gold-start">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/admin/dashboard/staff" className="text-gold-start hover:text-white transition-colors mb-4 inline-block">
                            ← Back to Staff Management
                        </Link>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-serif font-bold text-white mb-2">
                                    Billing Staff
                                </h1>
                                <p className="text-gold-start/80">Manage cashier terminals and transaction logs</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gold-start text-ruby-red rounded-lg hover:bg-gold-end transition-colors font-semibold shadow-lg"
                            >
                                <UserPlus size={20} />
                                Add Billing Staff
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="text-text-muted text-sm mb-1">Total Billing Staff</div>
                            <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="text-text-muted text-sm mb-1">Active</div>
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                            <div className="text-text-muted text-sm mb-1">Inactive</div>
                            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruby-red focus:border-transparent"
                            >
                                <option value="ALL">All Status</option>
                                <option value="ACTIVE">Active Only</option>
                                <option value="INACTIVE">Inactive Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Staff Count */}
                    <div className="mb-4">
                        <p className="text-text-muted">
                            Showing <span className="font-semibold text-text-primary">{billingStaff.length}</span> billing staff member{billingStaff.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Staff Table */}
                    {isLoading ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    ) : (
                        <StaffTable
                            staff={billingStaff}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddStaffModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                defaultRole={StaffRole.BILLING_STAFF}
            />
            <EditStaffModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} staff={selectedStaff} />
            <DeleteStaffConfirmation
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedStaff(null);
                }}
                onConfirm={confirmDelete}
                staff={selectedStaff}
                isDeleting={isDeleting}
            />
        </ProtectedRoute>
    );
}

export default function BillingStaffPage() {
    return (
        <StaffProvider>
            <BillingStaffContent />
        </StaffProvider>
    );
}
