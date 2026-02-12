"use client";

import React from 'react';
import { Download, Trash2, QrCode } from 'lucide-react';
import { Table, TableStatus } from '../../lib/tables.service';
import { useTables } from '../../contexts/TablesContext';
import { QRCodeCanvas } from 'qrcode.react';

interface TablesTableProps {
    tables: Table[];
    onDelete: (table: Table) => void;
    onViewQR: (table: Table) => void;
}

const CUSTOMER_APP_URL = process.env.NEXT_PUBLIC_CUSTOMER_APP_URL || 'https://customer-app.com';

export default function TablesTable({ tables, onDelete, onViewQR }: TablesTableProps) {
    const { toggleTableStatus } = useTables();

    const getStatusBadge = (status: TableStatus) => {
        const styles = {
            [TableStatus.EMPTY]: 'bg-green-100 text-green-800 border-green-300',
            [TableStatus.OCCUPIED]: 'bg-red-100 text-red-800 border-red-300',
        };
        return styles[status];
    };

    const handleToggle = async (id: string) => {
        try {
            await toggleTableStatus(id);
        } catch (error: any) {
            alert(error.message || 'Failed to toggle table status');
        }
    };

    const downloadQR = (table: Table) => {
        // Create a temporary container
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        const qrUrl = `${CUSTOMER_APP_URL}/order?table=${table.qr_token}`;

        // Use React to render QRCodeCanvas
        import('react-dom/client').then(({ createRoot }) => {
            const root = createRoot(tempDiv);

            // Render QR code with larger size
            root.render(
                React.createElement(QRCodeCanvas, {
                    value: qrUrl,
                    size: 512,
                    level: 'H',
                    includeMargin: true,
                })
            );

            // Wait for render then download
            setTimeout(() => {
                const canvas = tempDiv.querySelector('canvas');
                if (canvas) {
                    const url = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = `table-${table.table_number}-qr.png`;
                    link.href = url;
                    link.click();
                }
                root.unmount();
                document.body.removeChild(tempDiv);
            }, 100);
        });
    };

    if (tables.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                <div className="text-gray-300 mb-4">
                    <QrCode size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                    No tables found
                </h3>
                <p className="text-text-muted">
                    Create your first table to get started
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
                                Table Number
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                                QR Code
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Active
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tables.map((table) => {
                            const qrUrl = `${CUSTOMER_APP_URL}/order?table=${table.qr_token}`;

                            return (
                                <tr key={table.id} className="transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-lg font-bold text-text-primary">
                                            {table.table_number}
                                        </div>
                                        <div className="text-xs text-text-muted font-mono">
                                            {table.qr_token.slice(0, 12)}...
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center">
                                            <div className="bg-white p-2 rounded border border-gray-200">
                                                <QRCodeCanvas
                                                    value={qrUrl}
                                                    size={64}
                                                    level="H"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(table.table_status)}`}>
                                            {table.table_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleToggle(table.id)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${table.is_active ? 'bg-green-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${table.is_active ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onViewQR(table)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View QR Code"
                                            >
                                                <QrCode size={20} />
                                            </button>
                                            <button
                                                onClick={() => downloadQR(table)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Download QR"
                                            >
                                                <Download size={20} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(table)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Table"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
