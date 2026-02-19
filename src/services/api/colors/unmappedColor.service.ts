import { apiRequest } from '../client';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type {
    UnmappedColor,
    UnmappedColorListRequestDto,
    ResolveUnmappedColorDto,
    MasterColor,
} from '@/types/color';
import type { PaginatedResponse } from '@/types/common/base.types';
import type { BaseResponse } from '@/types';

/**
 * Unmapped Color Service
 * Provides API methods for managing unmapped colors
 */
export const unmappedColorService = {
    /**
     * Get filtered list of unmapped colors
     */
    async getList(
        request: UnmappedColorListRequestDto
    ): Promise<PaginatedResponse<UnmappedColor>> {
        const response = await apiRequest<BaseResponse<PaginatedResponse<UnmappedColor>>>(
            API_ENDPOINTS.UNMAPPED_COLORS.LIST,
            {
                method: 'POST',
                body: JSON.stringify(request),
            }
        );
        return response.data!;
    },

    /**
     * Get pending unmapped colors count
     */
    async getPendingCount(): Promise<number> {
        const response = await apiRequest<BaseResponse<number>>(
            API_ENDPOINTS.UNMAPPED_COLORS.PENDING_COUNT,
            { method: 'GET' }
        );
        return response.data || 0;
    },

    /**
     * Get unmapped color by ID
     */
    async getById(id: string): Promise<UnmappedColor | null> {
        const response = await apiRequest<BaseResponse<UnmappedColor>>(
            `${API_ENDPOINTS.UNMAPPED_COLORS.GET}/${id}`,
            { method: 'GET' }
        );
        return response.data || null;
    },

    /**
     * Get suggestions for unmapped color
     */
    async getSuggestions(id: string): Promise<MasterColor[]> {
        const response = await apiRequest<BaseResponse<MasterColor[]>>(
            `${API_ENDPOINTS.UNMAPPED_COLORS.SUGGESTIONS}/${id}/suggestions`,
            { method: 'GET' }
        );
        return response.data || [];
    },

    /**
     * Resolve unmapped color
     */
    async resolve(id: string, data: ResolveUnmappedColorDto): Promise<void> {
        await apiRequest<BaseResponse<boolean>>(
            `${API_ENDPOINTS.UNMAPPED_COLORS.RESOLVE}/${id}/resolve`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    },

    /**
     * Bulk ignore unmapped colors with low product count
     */
    async bulkIgnore(maxProductCount: number = 1): Promise<number> {
        const response = await apiRequest<BaseResponse<number>>(
            `${API_ENDPOINTS.UNMAPPED_COLORS.BULK_IGNORE}?maxProductCount=${maxProductCount}`,
            {
                method: 'POST',
            }
        );
        return response.data || 0;
    },
};
