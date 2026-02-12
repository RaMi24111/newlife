"use client";

import React from 'react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import StatusBadge from '../../components/StatusBadge';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Building2, Phone, Mail, MapPin, FileText } from 'lucide-react';
import Link from 'next/link';

export default function RestaurantProfile() {
    const { restaurant, isLoading, error } = useRestaurant();

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-paper-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ruby-red mx-auto"></div>
                        <p className="mt-4 text-text-muted">Loading restaurant profile...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error || !restaurant) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-paper-white flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-ruby-red font-semibold">Failed to load restaurant profile</p>
                        <p className="text-text-muted mt-2">{error || 'Restaurant data not available'}</p>
                        <Link href="/admin/dashboard" className="mt-4 inline-block text-ruby-red hover:underline">
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-paper-white">
                {/* Header */}
                <header className="bg-ruby-red py-8 px-8 shadow-lg border-b-4 border-gold-start">
                    <div className="max-w-6xl mx-auto">
                        <Link href="/admin/dashboard" className="text-gold-start hover:text-white transition-colors mb-4 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-serif font-bold text-white mb-2">
                            Restaurant Profile
                        </h1>
                        <p className="text-gold-start/80">View and manage your restaurant information</p>
                    </div>
                </header>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto p-8">
                    {/* Core Identity Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-text-primary mb-2">
                                    {restaurant.name}
                                </h2>
                                <p className="text-lg text-text-muted">{restaurant.restaurant_type}</p>
                            </div>
                            <StatusBadge status={restaurant.status} className="text-sm" />
                        </div>

                        {restaurant.description && (
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <FileText className="text-ruby-red mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h3 className="font-semibold text-text-primary mb-1">Description</h3>
                                    <p className="text-text-muted">{restaurant.description}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-ruby-red/10 p-3 rounded-lg">
                                    <Building2 className="text-ruby-red" size={24} />
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-text-primary">
                                    Contact Information
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Phone className="text-ruby-red mt-1 flex-shrink-0" size={20} />
                                    <div>
                                        <h3 className="font-semibold text-text-primary mb-1">Phone</h3>
                                        <a href={`tel:${restaurant.phone}`} className="text-text-muted hover:text-ruby-red transition-colors">
                                            {restaurant.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="text-ruby-red mt-1 flex-shrink-0" size={20} />
                                    <div>
                                        <h3 className="font-semibold text-text-primary mb-1">Email</h3>
                                        <a href={`mailto:${restaurant.email}`} className="text-text-muted hover:text-ruby-red transition-colors">
                                            {restaurant.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-ruby-red/10 p-3 rounded-lg">
                                    <MapPin className="text-ruby-red" size={24} />
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-text-primary">
                                    Address
                                </h2>
                            </div>

                            <div className="space-y-2 text-text-muted">
                                <p>{restaurant.address}</p>
                                <p>{restaurant.city}, {restaurant.state}</p>
                                <p>{restaurant.country} - {restaurant.pincode}</p>
                            </div>

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.address}, ${restaurant.city}, ${restaurant.state}, ${restaurant.country}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-block text-ruby-red hover:underline font-semibold"
                            >
                                View on Google Maps →
                            </a>
                        </div>
                    </div>

                    {/* Restaurant ID (for reference) */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-text-muted">
                            <span className="font-semibold">Restaurant ID:</span> {restaurant.id}
                        </p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
