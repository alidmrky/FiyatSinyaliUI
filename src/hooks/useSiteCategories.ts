import { useState, useEffect } from 'react'
import { SiteConfigService } from '@/services/api/siteConfig'
import type { SiteCategory } from '@/types/siteConfig'

/**
 * Hook for managing site categories
 */
export function useSiteCategories(siteId: string | null) {
    const [categories, setCategories] = useState<SiteCategory[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadCategories = async () => {
        if (!siteId) {
            setCategories([])
            return
        }

        try {
            setLoading(true)
            setError(null)
            const data = await SiteConfigService.getSiteCategories(siteId)
            setCategories(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load categories')
            console.error('Error loading site categories:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [siteId])

    return {
        categories,
        loading,
        error,
        reload: loadCategories,
    }
}
