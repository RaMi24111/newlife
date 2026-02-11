"use client";
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Input } from '@/app/admin/components/ui/Input';
import { Button } from '@/app/admin/components/ui/Button';

interface FormData {
    phone: string;
    otp: string;
}

export default function AdminLogin() {
    const router = useRouter();
    const [loginType, setLoginType] = useState<'admin' | 'staff'>('admin');
    
    // Admin Form Data
    const [formData, setFormData] = useState<FormData>({
        phone: '',
        otp: ''
    });

    // Staff Form Data
    const [staffId, setStaffId] = useState('');
    const [staffPassword, setStaffPassword] = useState('');
    const [staffRole, setStaffRole] = useState<'server' | 'cashier' | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Simulate a brief loading delay for UX
            await new Promise(resolve => setTimeout(resolve, 800));

            if (loginType === 'admin') {
                 // Basic validation for Admin
                if (!formData.phone || !formData.otp) {
                    setError('Please fill in all fields');
                    setLoading(false);
                    return;
                }
                // Mock successful login - navigate to dashboard
                router.push('/admin/dashboard');

            } else {
                // Basic validation for Staff
                if (!staffId || !staffPassword || !staffRole) {
                    setError('Please fill in all fields and select a role');
                    setLoading(false);
                    return;
                }
                 // Save the role to localStorage to be picked up by AuthContext
                 localStorage.setItem('extra_staff_role', staffRole);
                 
                // Mock successful login - navigate to staff dashboard
                router.push('/staff/staff-dashboard');
            }

        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold-start/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-ruby-red/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gold-start/20 relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-ruby-red mb-2">Portal Access</h1>
                     <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={() => { setLoginType('admin'); setError(''); }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                loginType === 'admin'
                                    ? 'bg-ruby-red text-white shadow-md'
                                    : 'bg-paper-white text-text-muted border border-gold-start/30 hover:bg-gold-start/10'
                            }`}
                        >
                            Admin Login
                        </button>
                        <button
                            onClick={() => { setLoginType('staff'); setError(''); }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                loginType === 'staff'
                                    ? 'bg-ruby-red text-white shadow-md'
                                    : 'bg-paper-white text-text-muted border border-gold-start/30 hover:bg-gold-start/10'
                            }`}
                        >
                            Staff Login
                        </button>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {loginType === 'admin' ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-dark">Phone Number / User ID</label>
                                <Input
                                    placeholder="Enter your ID or Phone"
                                    className="bg-paper-white border-gold-start/30 focus:border-ruby-red text-text-dark placeholder:text-text-muted/50"
                                    value={formData.phone}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-dark">Password / OTP</label>
                                <Input
                                    type="password"
                                    placeholder="Enter password"
                                    className="bg-paper-white border-gold-start/30 focus:border-ruby-red text-text-dark placeholder:text-text-muted/50"
                                    value={formData.otp}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, otp: e.target.value })}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                             <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-dark">Role</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'server', label: 'Server' },
                                        { id: 'cashier', label: 'Cashier' }
                                    ].map((role) => (
                                        <div
                                            key={role.id}
                                            onClick={() => setStaffRole(role.id as 'server' | 'cashier')}
                                            className={`cursor-pointer text-center py-2 rounded-lg border transition-all ${
                                                staffRole === role.id
                                                    ? 'bg-ruby-red/10 border-ruby-red text-ruby-red font-bold'
                                                    : 'border-gold-start/30 text-text-muted hover:border-ruby-red/50'
                                            }`}
                                        >
                                            {role.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-dark">Staff ID</label>
                                <Input
                                    placeholder="Enter Staff ID"
                                    className="bg-paper-white border-gold-start/30 focus:border-ruby-red text-text-dark placeholder:text-text-muted/50"
                                    value={staffId}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setStaffId(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-dark">Password</label>
                                <Input
                                    type="password"
                                    placeholder="Enter password"
                                    className="bg-paper-white border-gold-start/30 focus:border-ruby-red text-text-dark placeholder:text-text-muted/50"
                                    value={staffPassword}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setStaffPassword(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-linear-to-r from-gold-start to-gold-end text-ruby-red font-bold hover:shadow-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : `Login as ${loginType === 'admin' ? 'Admin' : 'Staff'}`}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-text-muted hover:text-ruby-red underline decoration-gold-start/50">
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
