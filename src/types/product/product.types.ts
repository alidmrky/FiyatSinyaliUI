/**
 * Product entity
 */
export interface Product {
    id: string
    name: string
    brand: string
    currentPrice: number
    originalPrice?: number
    discount?: number
    imageUrl: string
    siteCode: string
    siteName: string
    categoryCode: string
    categoryName: string
    url: string
    lastUpdated: Date
    inStock: boolean
}

/**
 * Product list request parameters
 */
export interface ProductListParams {
    page?: number
    pageSize?: number
    siteCode?: string
    categoryCode?: string
    minPrice?: number
    maxPrice?: number
    search?: string
}

/**
 * Product search parameters
 */
export interface ProductSearchParams {
    query: string
    siteCode?: string
    categoryCode?: string
}

// Re-export PaginatedResponse from common so product-related code has one import point
export type { PaginatedResponse } from '@/types/common/base.types'

