/**
 * Full category entity with all fields
 */
export interface Category {
    id: string
    name: string
    code: string
    slug: string
    description?: string
    parentId?: string
    level: number
    path: string[]
    sortOrder: number
    productCount: number
    isLeaf: boolean
    createdAt: string
    updatedAt?: string
}

/**
 * Simplified category for list views
 */
export interface CategoryListItem {
    id: string
    name: string
    code: string
    slug: string
    description?: string
    parentId?: string
    level: number
    sortOrder: number
    productCount: number
    isLeaf: boolean
}

/**
 * Hierarchical category structure with recursive children
 */
export interface CategoryTree {
    id: string
    name: string
    code: string
    slug: string
    description?: string
    parentId?: string
    level: number
    path: string[]
    sortOrder: number
    productCount: number
    isLeaf: boolean
    children?: CategoryTree[]
}

/**
 * DTO for creating new categories
 */
export interface CreateCategoryDto {
    name: string
    code: string
    slug?: string
    description?: string
    parentId?: string
    sortOrder?: number
    isLeaf?: boolean
}

/**
 * DTO for updating existing categories
 */
export interface UpdateCategoryDto {
    name: string
    code: string
    slug: string
    description?: string
    parentId?: string
    sortOrder?: number
    isLeaf?: boolean
}
