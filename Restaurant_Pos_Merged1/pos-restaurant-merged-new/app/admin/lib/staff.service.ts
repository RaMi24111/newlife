/**
 * Staff Service
 * Handles staff member management
 */

import { apiService } from './api.service';
import { API_CONFIG } from './api.config';

// Staff Role Enum
export enum StaffRole {
    SERVING_STAFF = 'SERVING_STAFF',
    BILLING_STAFF = 'BILLING_STAFF'
}

// Staff Member Interface
export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: StaffRole;
    phone?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

// Request/Response Types
export interface CreateStaffRequest {
    name: string;
    email: string;
    password: string; // Backend will auto-generate, but field is required
    role: StaffRole;
}

export interface UpdateStaffRequest {
    name?: string;
    role?: StaffRole;
    phone?: string;
}

class StaffService {
    /**
     * Get all staff members
     */
    async getStaffList(): Promise<StaffMember[]> {
        try {
            const staff = await apiService.get<StaffMember[]>(
                API_CONFIG.ENDPOINTS.STAFF.LIST,
                true
            );
            return staff;
        } catch (error) {
            console.error('Failed to fetch staff list:', error);
            throw error;
        }
    }

    /**
     * Create new staff member
     */
    async createStaff(data: CreateStaffRequest): Promise<StaffMember> {
        try {
            const staff = await apiService.post<StaffMember>(
                API_CONFIG.ENDPOINTS.STAFF.CREATE,
                data,
                true
            );
            return staff;
        } catch (error) {
            console.error('Failed to create staff member:', error);
            throw error;
        }
    }

    /**
     * Update staff member
     */
    async updateStaff(id: string, data: UpdateStaffRequest): Promise<StaffMember> {
        try {
            const staff = await apiService.put<StaffMember>(
                API_CONFIG.ENDPOINTS.STAFF.UPDATE(id),
                data,
                true
            );
            return staff;
        } catch (error) {
            console.error('Failed to update staff member:', error);
            throw error;
        }
    }

    /**
     * Toggle staff member active/inactive status
     */
    async toggleStaffStatus(id: string): Promise<StaffMember> {
        try {
            const staff = await apiService.patch<StaffMember>(
                API_CONFIG.ENDPOINTS.STAFF.TOGGLE(id),
                {},
                true
            );
            return staff;
        } catch (error) {
            console.error('Failed to toggle staff status:', error);
            throw error;
        }
    }

    /**
     * Delete staff member
     */
    async deleteStaff(id: string): Promise<void> {
        try {
            await apiService.delete(
                API_CONFIG.ENDPOINTS.STAFF.DELETE(id),
                true
            );
        } catch (error) {
            console.error('Failed to delete staff member:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const staffService = new StaffService();
