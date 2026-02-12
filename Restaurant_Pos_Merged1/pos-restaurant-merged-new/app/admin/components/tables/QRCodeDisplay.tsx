"use client";

import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check } from 'lucide-react';

interface QRCodeDisplayProps {
    qrToken: string;
    tableNumber: string;
    size?: number;
    showDownload?: boolean;
    showCopy?: boolean;
}

// Customer app URL - should be configurable via environment variable
const CUSTOMER_APP_URL = process.env.NEXT_PUBLIC_CUSTOMER_APP_URL || 'https://customer-app.com';

export default function QRCodeDisplay({
    qrToken,
    tableNumber,
    size = 256,
    showDownload = true,
    showCopy = true,
}: QRCodeDisplayProps) {
    const qrRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = React.useState(false);

    // Generate QR URL
    const qrUrl = `${CUSTOMER_APP_URL}/order?table=${qrToken}`;

    const downloadQRCode = (format: 'png' | 'svg' = 'png') => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;

        if (format === 'png') {
            // Download as PNG
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `table-${tableNumber}-qr.png`;
            link.href = url;
            link.click();
        } else {
            // For SVG, we'd need to use a different QR library or convert canvas to SVG
            // For now, just download PNG
            downloadQRCode('png');
        }
    };

    const copyQRLink = async () => {
        try {
            await navigator.clipboard.writeText(qrUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* QR Code */}
            <div ref={qrRef} className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCodeCanvas
                    value={qrUrl}
                    size={size}
                    level="H"
                    includeMargin={true}
                />
            </div>

            {/* Table Info */}
            <div className="text-center">
                <div className="text-sm text-text-muted">Table {tableNumber}</div>
                <div className="text-xs text-text-muted font-mono mt-1 break-all max-w-xs">
                    {qrUrl}
                </div>
            </div>

            {/* Actions */}
            {(showDownload || showCopy) && (
                <div className="flex gap-2">
                    {showDownload && (
                        <button
                            onClick={() => downloadQRCode('png')}
                            className="flex items-center gap-2 px-4 py-2 bg-ruby-red text-white rounded-lg hover:bg-ruby-red/90 transition-colors text-sm font-semibold"
                        >
                            <Download size={16} />
                            Download PNG
                        </button>
                    )}
                    {showCopy && (
                        <button
                            onClick={copyQRLink}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
