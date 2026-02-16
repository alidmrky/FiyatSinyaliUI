import { useState, useEffect } from 'react'
import { SiteConfigService } from '@/services/api/siteConfig'
import type { SiteConfiguration } from '@/types/siteConfig'

/**
 * Hook for managing site configurations
 */
export function useSiteConfigs() {
    const [sites, setSites] = useState<SiteConfiguration[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadSites = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await SiteConfigService.getAllSites()
            setSites(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load sites')
            console.error('Error loading sites:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSites()
    }, [])

    return {
        sites,
        loading,
        error,
        reload: loadSites,
    }
}
