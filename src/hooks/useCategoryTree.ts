import { useState, useEffect } from 'react'
import { CategoryService } from '@/services/api/categories'
import type { CategoryTree } from '@/types/category'

/**
 * Hook for fetching and managing hierarchical category tree
 */
export function useCategoryTree() {
    const [tree, setTree] = useState<CategoryTree[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadTree()
    }, [])

    const loadTree = async () => {
        try {
            setLoading(true)
            const data = await CategoryService.getCategoryTree()
            setTree(data)
            setError(null)
        } catch (err) {
            setError('Kategori ağacı yüklenirken hata oluştu')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return { tree, loading, error, reload: loadTree }
}
