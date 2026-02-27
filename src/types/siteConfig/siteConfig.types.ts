export enum SiteType {
    Retail = 0,
    Marketplace = 1
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
    masterCategoryCode?: string
    isAutoMapped: boolean
    mappingConfidence: number
    priority: number
    section?: string
    storeId?: string
    locale?: string
    lastFullScan?: string
    nextFullScan?: string
    lastPriceScan?: string
    nextPriceScanAt?: string
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
    lastFullScan?: string | null
    nextFullScan?: string | null
    lastPriceScan?: string | null
    nextPriceScanAt?: string | null
}
