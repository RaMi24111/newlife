/**
 * Restaurant Service
 * Handles fetching and managing restaurant profile data
 */

import { apiService } from './api.service';
import { API_CONFIG } from './api.config';

export interface RestaurantProfile {
    id: string;
    name: string;
    type: string;
    status: 'ACTIVE' | 'INACTIVE';
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    contact: {
        phone: string;
        email: string;
        website?: string;
    };
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
