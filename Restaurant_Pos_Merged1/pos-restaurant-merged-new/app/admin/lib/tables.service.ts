/**
 * Tables Service
 * Handles restaurant table management
 */

import { apiService } from './api.service';
import { API_CONFIG } from './api.config';

// Table Status Enum
export enum TableStatus {
    EMPTY = 'EMPTY',
    OCCUPIED = 'OCCUPIED'
}

// Table Interface
export interface Table {
    id: string;
    table_number: string;
    qr_token: string;
    table_status: TableStatus;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

// Request Types
export interface CreateTableRequest {
    table_number: string;
}

class TablesService {
    /**
     * Get all tables
     */
    async getTablesList(): Promise<Table[]> {
        try {
            const tables = await apiService.get<Table[]>(
                API_CONFIG.ENDPOINTS.TABLES.LIST,
                true
            );
            return tables;
        } catch (error) {
            console.error('Failed to fetch tables list:', error);
            throw error;
        }
    }

    /**
     * Create new table
     */
    async createTable(data: CreateTableRequest): Promise<Table> {
        try {
            const table = await apiService.post<Table>(
                API_CONFIG.ENDPOINTS.TABLES.CREATE,
                data,
                true
            );
            return table;
        } catch (error) {
            console.error('Failed to create table:', error);
            throw error;
        }
    }

    /**
     * Toggle table active/inactive status
     */
    async toggleTableStatus(id: string): Promise<Table> {
        try {
            const table = await apiService.patch<Table>(
                API_CONFIG.ENDPOINTS.TABLES.TOGGLE(id),
                {},
                true
            );
            return table;
        } catch (error) {
            console.error('Failed to toggle table status:', error);
            throw error;
        }
    }

    /**
     * Delete table
     */
    async deleteTable(id: string): Promise<void> {
        try {
            await apiService.delete(
                API_CONFIG.ENDPOINTS.TABLES.DELETE(id),
                true
            );
        } catch (error) {
            console.error('Failed to delete table:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const tablesService = new TablesService();
