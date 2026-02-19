import { apiRequest } from '../client';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type {
    UnmappedBrand,
    UnmappedBrandListRequestDto,
    ResolveUnmappedBrandDto,
    MasterBrand,
} from '@/types/brand';
import type { PaginatedResponse } from '@/types/common/base.types';
import type { BaseResponse } from '@/types';

/**
 * Unmapped Brand Service
 * Provides API methods for managing unmapped brands
 */
export const unmappedBrandService = {
    /**
     * Get filtered list of unmapped brands
     */
    async getList(
        request: UnmappedBrandListRequestDto
    ): Promise<PaginatedResponse<UnmappedBrand>> {
        const response = await apiRequest<BaseResponse<PaginatedResponse<UnmappedBrand>>>(
            API_ENDPOINTS.UNMAPPED_BRANDS.LIST,
            {
                method: 'POST',
                body: JSON.stringify(request),
            }
        );
        return response.data!;
    },

    /**
     * Get pending unmapped brands count
     */
    async getPendingCount(): Promise<number> {
        const response = await apiRequest<BaseResponse<number>>(
            API_ENDPOINTS.UNMAPPED_BRANDS.PENDING_COUNT,
            { method: 'GET' }
        );
        return response.data || 0;
    },

    /**
     * Get unmapped brand by ID
     */
    async getById(id: string): Promise<UnmappedBrand | null> {
        const response = await apiRequest<BaseResponse<UnmappedBrand>>(
            `${API_ENDPOINTS.UNMAPPED_BRANDS.GET}/${id}`,
            { method: 'GET' }
        );
        return response.data || null;
    },

    /**
     * Get suggestions for unmapped brand
     */
    async getSuggestions(id: string): Promise<MasterBrand[]> {
        const response = await apiRequest<BaseResponse<MasterBrand[]>>(
            `${API_ENDPOINTS.UNMAPPED_BRANDS.SUGGESTIONS}/${id}/suggestions`,
            { method: 'GET' }
        );
        return response.data || [];
    },

    /**
     * Resolve unmapped brand
     */
    async resolve(id: string, data: ResolveUnmappedBrandDto): Promise<void> {
        await apiRequest<BaseResponse<boolean>>(
            `${API_ENDPOINTS.UNMAPPED_BRANDS.RESOLVE}/${id}/resolve`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    },

    /**
     * Bulk ignore unmapped brands
     */
    async bulkIgnore(maxProductCount: number = 1): Promise<number> {
        const response = await apiRequest<BaseResponse<number>>(
            `${API_ENDPOINTS.UNMAPPED_BRANDS.BULK_IGNORE}?maxProductCount=${maxProductCount}`,
            {
                method: 'POST',
            }
        );
        return response.data || 0;
    },
};
