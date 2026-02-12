/**
 * Restaurant Service
 * Handles fetching and managing restaurant profile data
 */

import { apiService } from './api.service';
import { API_CONFIG } from './api.config';

export interface RestaurantProfile {
    // Core Identity
    id: string;
    name: string;
    restaurant_type: string; // Cafe / Restaurant / Cloud Kitchen
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

    // Description & Contact
    description?: string;
    phone: string;
    email: string;

    // Address Info
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

class RestaurantService {
    /**
     * Get restaurant profile data
     */
    async getRestaurantProfile(): Promise<RestaurantProfile> {
        try {
            const profile = await apiService.get<RestaurantProfile>(
                API_CONFIG.ENDPOINTS.ADMIN.RESTAURANT,
                true // Requires authentication
            );

            return profile;
        } catch (error) {
            console.error('Failed to fetch restaurant profile:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const restaurantService = new RestaurantService();
