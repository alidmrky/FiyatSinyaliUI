import { apiRequest } from '../client'
import type {
    SiteConfiguration,
    SiteCategory,
    CreateSiteConfigDto,
    UpdateSiteConfigDto,
    CreateSiteCategoryDto,
    UpdateSiteCategoryDto,
} from '@/types/siteConfig'

/**
 * Site Configuration API Service
 * Provides methods for interacting with the Site Configuration API
 */
export class SiteConfigService {
    // ==================== Site CRUD ====================

    /**
     * Fetch all site configurations
     */
    static async getAllSites(): Promise<SiteConfiguration[]> {
        return apiRequest<SiteConfiguration[]>('api/siteconfigurations')
    }

    /**
     * Fetch single site configuration by ID
     */
    static async getSiteById(id: string): Promise<SiteConfiguration> {
        return apiRequest<SiteConfiguration>(`api/siteconfigurations/${id}`)
    }

    /**
     * Fetch single site configuration by name
     */
    static async getSiteByName(siteName: string): Promise<SiteConfiguration> {
        return apiRequest<SiteConfiguration>(`api/siteconfigurations/by-name/${siteName}`)
    }

    /**
     * Create new site configuration
     */
    static async createSite(dto: CreateSiteConfigDto): Promise<SiteConfiguration> {
        return apiRequest<SiteConfiguration>('api/siteconfigurations', {
            method: 'POST',
            body: JSON.stringify(dto),
        })
    }

    /**
     * Update existing site configuration
     */
    static async updateSite(id: string, dto: UpdateSiteConfigDto): Promise<SiteConfiguration> {
        return apiRequest<SiteConfiguration>(`api/siteconfigurations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dto),
        })
    }

    /**
     * Delete site configuration
     */
    static async deleteSite(id: string): Promise<boolean> {
        return apiRequest<boolean>(`api/siteconfigurations/${id}`, {
            method: 'DELETE',
        })
    }

    // ==================== Site Category Management ====================

    /**
     * Fetch all categories for a specific site
     */
    static async getSiteCategories(siteId: string): Promise<SiteCategory[]> {
        return apiRequest<SiteCategory[]>(`api/siteconfigurations/${siteId}/categories`)
    }

    /**
     * Add new category to site
     */
    static async addSiteCategory(
        siteId: string,
        dto: CreateSiteCategoryDto
    ): Promise<SiteCategory> {
        return apiRequest<SiteCategory>(`api/siteconfigurations/${siteId}/categories`, {
            method: 'POST',
            body: JSON.stringify(dto),
        })
    }

    /**
     * Update site category
     */
    static async updateSiteCategory(
        siteId: string,
        categoryId: string,
        dto: UpdateSiteCategoryDto
    ): Promise<SiteCategory> {
        return apiRequest<SiteCategory>(
            `api/siteconfigurations/${siteId}/categories/${categoryId}`,
            {
                method: 'PUT',
                body: JSON.stringify(dto),
            }
        )
    }

    /**
     * Delete site category
     */
    static async deleteSiteCategory(siteId: string, categoryId: string): Promise<boolean> {
        return apiRequest<boolean>(
            `api/siteconfigurations/${siteId}/categories/${categoryId}`,
            {
                method: 'DELETE',
            }
        )
    }
}
