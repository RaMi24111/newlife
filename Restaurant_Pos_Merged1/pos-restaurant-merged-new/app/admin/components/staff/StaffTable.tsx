"use client";

import React from 'react';
import { Edit2, Trash2, Mail, Phone, User } from 'lucide-react';
import { StaffMember, StaffRole } from '../../lib/staff.service';
import { useStaff } from '../../contexts/StaffContext';

interface StaffTableProps {
    staff: StaffMember[];
    onEdit: (member: StaffMember) => void;
    onDelete: (member: StaffMember) => void;
}

export default function StaffTable({ staff, onEdit, onDelete }: StaffTableProps) {
    const { toggleStaffStatus } = useStaff();
    const [togglingId, setTogglingId] = React.useState<string | null>(null);

    const handleToggle = async (id: string) => {
        setTogglingId(id);
        try {
            await toggleStaffStatus(id);
        } catch (error: any) {
            alert(error.message || 'Failed to toggle status');
        } finally {
            setTogglingId(null);
        }
    };

    const getRoleBadgeColor = (role: StaffRole) => {
        switch (role) {
            case StaffRole.SERVING_STAFF:
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case StaffRole.BILLING_STAFF:
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getRoleLabel = (role: StaffRole) => {
        switch (role) {
            case StaffRole.SERVING_STAFF:
                return 'Serving Staff';
            case StaffRole.BILLING_STAFF:
                return 'Billing Staff';
            default:
                return role;
        }
    };

    if (staff.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                <div className="text-gray-300 mb-4">
                    <User size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                    No staff members found
                </h3>
                <p className="text-text-muted">
                    Get started by adding your first staff member
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {staff.map((member) => (
                            <tr
                                key={member.id}
                                className={`transition-colors hover:bg-gray-50 ${!member.is_active ? 'opacity-50 bg-gray-50' : ''
                                    }`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-ruby-red/10 p-2 rounded-full">
                                            <User className="text-ruby-red" size={20} />
                                        </div>
                                        <div className="font-semibold text-text-primary">
                                            {member.name}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-text-muted">
                                        <Mail size={16} />
                                        <span className="text-sm">{member.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                                            member.role
                                        )}`}
                                    >
                                        {getRoleLabel(member.role)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {member.phone ? (
                                        <div className="flex items-center gap-2 text-text-muted">
                                            <Phone size={16} />
                                            <span className="text-sm">{member.phone}</span>
                                        </div>
                                    ) : (
                                        <span className="text-text-muted text-sm">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleToggle(member.id)}
                                        disabled={togglingId === member.id}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${member.is_active ? 'bg-green-500' : 'bg-gray-300'
                                            } ${togglingId === member.id
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'cursor-pointer'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${member.is_active ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(member)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit staff member"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(member)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete staff member"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
