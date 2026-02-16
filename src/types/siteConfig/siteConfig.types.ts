export enum SiteType {
    Retail = 'Retail',
    Marketplace = 'Marketplace'
}

export interface SiteConfiguration {
    id: string
    siteName: string
    displayName: string
    baseUrl: string
    isEnabled: boolean
    scrapingIntervalMinutes: number
    maxRetryAttempts: number
    requestDelayMs: number
    categories: SiteCategory[]
    siteType: SiteType
    createdAt: string
    createdBy?: string
    updatedAt?: string
    updatedBy?: string
    isDeleted?: boolean
    deletedAt?: string
    deletedBy?: string
}

export interface SiteCategory {
    id: string
    name: string
    categoryUrl: string
    searchQuery?: string
    parentId?: string
    isLeaf: boolean
    isEnabled: boolean
    leafPath: string
    children?: SiteCategory[]
    masterCategoryId?: string
    isAutoMapped: boolean
    mappingConfidence: number
    priority: number
    section?: string
    storeId?: string
    locale?: string
}

export interface CreateSiteConfigDto {
    siteName: string
    displayName: string
    baseUrl: string
    isEnabled?: boolean
    scrapingIntervalMinutes?: number
    maxRetryAttempts?: number
    requestDelayMs?: number
    siteType?: SiteType
}

export interface UpdateSiteConfigDto {
    siteName?: string
    displayName?: string
    baseUrl?: string
    isEnabled?: boolean
    scrapingIntervalMinutes?: number
    maxRetryAttempts?: number
    requestDelayMs?: number
    siteType?: SiteType
}

export interface CreateSiteCategoryDto {
    name: string
    categoryUrl: string
    searchQuery?: string
    parentId?: string
    isLeaf?: boolean
    isEnabled?: boolean
    masterCategoryId?: string
    section?: string
    storeId?: string
    locale?: string
    priority?: number
}

export interface UpdateSiteCategoryDto {
    name?: string
    categoryUrl?: string
    searchQuery?: string
    parentId?: string
    isLeaf?: boolean
    isEnabled?: boolean
    masterCategoryId?: string
    section?: string
    storeId?: string
    locale?: string
    priority?: number
    isAutoMapped?: boolean
    mappingConfidence?: number
}
