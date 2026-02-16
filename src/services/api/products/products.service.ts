import { apiRequestWithUnwrap } from '../client'
import { API_ENDPOINTS } from '@/constants'
import type { Product, ProductListParams, ProductSearchParams, PaginatedResponse } from '@/types'

/**
 * Products API service
 */
export const productsService = {
    /**
     * Get paginated product list
     */
    async getList(params?: ProductListParams): Promise<PaginatedResponse<Product>> {
        const queryParams = new URLSearchParams()

        if (params?.page) queryParams.append('page', params.page.toString())
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
        if (params?.siteCode) queryParams.append('siteCode', params.siteCode)
        if (params?.categoryCode) queryParams.append('categoryCode', params.categoryCode)
        if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString())
        if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString())
        if (params?.search) queryParams.append('search', params.search)

        const endpoint = `${API_ENDPOINTS.PRODUCTS.LIST}?${queryParams.toString()}`

        return apiRequestWithUnwrap<PaginatedResponse<Product>>(endpoint, {
            method: 'POST',
            body: JSON.stringify(params || {}),
        })
    },

    /**
     * Get product by ID
     */
    async getById(id: string): Promise<Product> {
        return apiRequestWithUnwrap<Product>(`${API_ENDPOINTS.PRODUCTS.GET}/${id}`)
    },

    /**
     * Search products
     */
    async search(params: ProductSearchParams): Promise<Product[]> {
        return apiRequestWithUnwrap<Product[]>(API_ENDPOINTS.PRODUCTS.SEARCH, {
            method: 'POST',
            body: JSON.stringify(params),
        })
    },
}
