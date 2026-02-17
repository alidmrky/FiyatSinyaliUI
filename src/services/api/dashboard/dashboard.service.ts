import { apiRequest } from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { BaseResponse } from '@/types';
import type {
    DashboardStats,
    MongoProductStats,
    PostgreProductStats,
} from '@/types/dashboard';

/**
 * Dashboard API Service
 * Handles all dashboard statistics endpoints
 */
export const dashboardService = {
    /**
     * Get complete dashboard statistics
     * Includes MongoDB and PostgreSQL stats
     */
    async getStats(): Promise<DashboardStats> {
        const response = await apiRequest<BaseResponse<DashboardStats>>(
            API_ENDPOINTS.DASHBOARD.STATS,
            { method: 'GET' }
        );
        return response.data!;
    },

    /**
     * Get MongoDB product statistics only
     */
    async getMongoStats(): Promise<MongoProductStats> {
        const response = await apiRequest<BaseResponse<MongoProductStats>>(
            API_ENDPOINTS.DASHBOARD.MONGO_STATS,
            { method: 'GET' }
        );
        return response.data!;
    },

    /**
     * Get PostgreSQL product statistics only
     */
    async getPostgreStats(): Promise<PostgreProductStats> {
        const response = await apiRequest<BaseResponse<PostgreProductStats>>(
            API_ENDPOINTS.DASHBOARD.POSTGRE_STATS,
            { method: 'GET' }
        );
        return response.data!;
    },
};
