import { useState, useEffect } from 'react'
import { CategoryService } from '@/services/api/categories'
import type { CategoryListItem } from '@/types/category'

/**
 * Hook for fetching and managing flat category list
 */
export function useCategories() {
    const [categories, setCategories] = useState<CategoryListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            setLoading(true)
            const data = await CategoryService.getAllCategories()
            setCategories(data)
            setError(null)
        } catch (err) {
            setError('Kategoriler yüklenirken hata oluştu')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return { categories, loading, error, reload: loadCategories }
}
