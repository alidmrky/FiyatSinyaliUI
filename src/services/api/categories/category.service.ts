import { apiRequestWithResult } from '../client'
import type {
    Category,
    CategoryListItem,
    CategoryTree,
    CreateCategoryDto,
    UpdateCategoryDto,
} from '@/types/category'

/**
 * Category API Service
 * Provides methods for interacting with the Category API
 */
export class CategoryService {
    /**
     * Fetch all categories (flat list)
     */
    static async getAllCategories(): Promise<CategoryListItem[]> {
        return apiRequestWithResult<CategoryListItem[]>('api/categories')
    }

    /**
     * Fetch hierarchical category tree
     */
    static async getCategoryTree(): Promise<CategoryTree[]> {
        return apiRequestWithResult<CategoryTree[]>('api/categories/tree')
    }

    /**
     * Fetch top-level (root) categories
     */
    static async getRootCategories(): Promise<CategoryListItem[]> {
        return apiRequestWithResult<CategoryListItem[]>('api/categories/root')
    }

    /**
     * Fetch single category by ID
     */
    static async getCategoryById(id: string): Promise<Category> {
        return apiRequestWithResult<Category>(`api/categories/${id}`)
    }

    /**
     * Fetch single category by slug
     */
    static async getCategoryBySlug(slug: string): Promise<Category> {
        return apiRequestWithResult<Category>(`api/categories/slug/${slug}`)
    }

    /**
     * Fetch child categories
     * @param parentId - Optional parent category ID. If not provided, returns root categories
     */
    static async getChildCategories(parentId?: string): Promise<CategoryListItem[]> {
        const params = parentId ? `?parentId=${parentId}` : ''
        return apiRequestWithResult<CategoryListItem[]>(`api/categories/children${params}`)
    }

    /**
     * Search categories by term
     */
    static async searchCategories(searchTerm: string): Promise<CategoryListItem[]> {
        return apiRequestWithResult<CategoryListItem[]>(
            `api/categories/search?searchTerm=${encodeURIComponent(searchTerm)}`
        )
    }

    /**
     * Create new category
     */
    static async createCategory(dto: CreateCategoryDto): Promise<Category> {
        return apiRequestWithResult<Category>('api/categories', {
            method: 'POST',
            body: JSON.stringify(dto),
        })
    }

    /**
     * Update existing category
     */
    static async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
        return apiRequestWithResult<Category>(`api/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dto),
        })
    }

    /**
     * Delete category
     */
    static async deleteCategory(id: string): Promise<boolean> {
        return apiRequestWithResult<boolean>(`api/categories/${id}`, {
            method: 'DELETE',
        })
    }

    /**
     * Update category sort order
     */
    static async updateSortOrder(id: string, sortOrder: number): Promise<boolean> {
        return apiRequestWithResult<boolean>(`api/categories/${id}/sort-order`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sortOrder),
        })
    }
}
