import { apiRequest } from '../client';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type {
    MasterBrand,
    CreateMasterBrandDto,
    UpdateMasterBrandDto,
    CreateBrandAlternativeDto,
    BrandAlternative
} from '@/types/brand';
import type { BaseResponse } from '@/types';

/**
 * Master Brand Service
 * Provides API methods for managing master brands
 */
export const masterBrandService = {
    /**
     * Get all master brands
     */
    async getAll(): Promise<MasterBrand[]> {
        const response = await apiRequest<BaseResponse<MasterBrand[]>>(
            API_ENDPOINTS.BRANDS.LIST,
            { method: 'GET' }
        );
        return response.data || [];
    },

    /**
     * Get master brand by ID
     */
    async getById(id: string): Promise<MasterBrand | null> {
        const response = await apiRequest<BaseResponse<MasterBrand>>(
            `${API_ENDPOINTS.BRANDS.GET}/${id}`,
            { method: 'GET' }
        );
        return response.data || null;
    },

    /**
     * Search master brands by name
     */
    async search(query: string): Promise<MasterBrand[]> {
        const response = await apiRequest<BaseResponse<MasterBrand[]>>(
            `${API_ENDPOINTS.BRANDS.SEARCH}?q=${encodeURIComponent(query)}`,
            { method: 'GET' }
        );
        return response.data || [];
    },

    /**
     * Get top brands by product count
     */
    async getTop(limit: number = 10): Promise<MasterBrand[]> {
        const response = await apiRequest<BaseResponse<MasterBrand[]>>(
            `${API_ENDPOINTS.BRANDS.TOP}?limit=${limit}`,
            { method: 'GET' }
        );
        return response.data || [];
    },

    /**
     * Create new master brand
     */
    async create(data: CreateMasterBrandDto): Promise<MasterBrand> {
        const response = await apiRequest<BaseResponse<MasterBrand>>(
            API_ENDPOINTS.BRANDS.CREATE,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
        return response.data!;
    },

    /**
     * Update master brand
     */
    async update(id: string, data: UpdateMasterBrandDto): Promise<MasterBrand> {
        const response = await apiRequest<BaseResponse<MasterBrand>>(
            `${API_ENDPOINTS.BRANDS.UPDATE}/${id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );
        return response.data!;
    },

    /**
     * Delete master brand
     */
    async delete(id: string): Promise<void> {
        await apiRequest<BaseResponse<boolean>>(
            `${API_ENDPOINTS.BRANDS.DELETE}/${id}`,
            { method: 'DELETE' }
        );
    },

    /**
     * Add alternative name to master brand
     */
    async addAlternative(
        masterBrandId: string,
        data: CreateBrandAlternativeDto
    ): Promise<BrandAlternative> {
        const response = await apiRequest<BaseResponse<BrandAlternative>>(
            `${API_ENDPOINTS.BRANDS.ADD_ALTERNATIVE}/${masterBrandId}/alternatives`,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
        return response.data!;
    },
};
