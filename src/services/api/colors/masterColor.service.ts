import { apiRequest } from '../client';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type {
    MasterColor,
    CreateMasterColorDto,
    UpdateMasterColorDto,
    CreateColorAlternativeDto,
    ColorAlternative,
    MasterColorFilterRequest,
} from '@/types/color';
import type { PaginatedResponse } from '@/types/common/base.types';
import type { BaseResponse } from '@/types';

/**
 * Master Color Service
 * Provides API methods for managing master colors
 */
export const masterColorService = {
    /**
     * Get paginated and filtered master colors list
     */
    async getList(request: MasterColorFilterRequest): Promise<PaginatedResponse<MasterColor>> {
        const response = await apiRequest<BaseResponse<PaginatedResponse<MasterColor>>>(
            `${API_ENDPOINTS.COLORS.LIST}/list`,
            {
                method: 'POST',
                body: JSON.stringify(request),
            }
        );
        return response.data!;
    },

    /**
     * Get all master colors (without pagination)
     */
    async getAll(): Promise<MasterColor[]> {
        const response = await apiRequest<BaseResponse<MasterColor[]>>(
            API_ENDPOINTS.COLORS.LIST,
            { method: 'GET' }
        );
        return response.data || [];
    },

    /**
     * Get master color by ID
     */
    async getById(id: string): Promise<MasterColor | null> {
        const response = await apiRequest<BaseResponse<MasterColor>>(
            `${API_ENDPOINTS.COLORS.GET}/${id}?includeAlternatives=true`,
            { method: 'GET' }
        );
        return response.data || null;
    },

    /**
     * Search master colors by name
     */
    async search(query: string): Promise<MasterColor[]> {
        const response = await apiRequest<BaseResponse<MasterColor[]>>(
            `${API_ENDPOINTS.COLORS.SEARCH}?term=${encodeURIComponent(query)}`,
            { method: 'GET' }
        );
        return response.data || [];
    },

    /**
     * Get top colors by product count
     */
    async getTop(limit: number = 10): Promise<MasterColor[]> {
        const response = await apiRequest<BaseResponse<MasterColor[]>>(
            `${API_ENDPOINTS.COLORS.TOP}?limit=${limit}`,
            { method: 'GET' }
        );
        return response.data || [];
    },

    /**
     * Create new master color
     */
    async create(data: CreateMasterColorDto): Promise<MasterColor> {
        const response = await apiRequest<BaseResponse<MasterColor>>(
            API_ENDPOINTS.COLORS.CREATE,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
        return response.data!;
    },

    /**
     * Update master color
     */
    async update(id: string, data: UpdateMasterColorDto): Promise<MasterColor> {
        const response = await apiRequest<BaseResponse<MasterColor>>(
            `${API_ENDPOINTS.COLORS.UPDATE}/${id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );
        return response.data!;
    },

    /**
     * Delete master color
     */
    async delete(id: string): Promise<void> {
        await apiRequest<BaseResponse<boolean>>(
            `${API_ENDPOINTS.COLORS.DELETE}/${id}`,
            { method: 'DELETE' }
        );
    },

    /**
     * Add alternative name to master color
     */
    async addAlternative(
        masterColorId: string,
        data: CreateColorAlternativeDto
    ): Promise<ColorAlternative> {
        const response = await apiRequest<BaseResponse<ColorAlternative>>(
            `${API_ENDPOINTS.COLORS.ADD_ALTERNATIVE}/${masterColorId}/alternatives`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
        return response.data!;
    },
};
