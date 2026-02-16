import { apiRequestWithResult } from '../client'
import { ScraperHealthCheck } from '@/types/scraper.types'

export const healthApi = {
    /**
     * Get all scraper health checks
     */
    getAll: () =>
        apiRequestWithResult<ScraperHealthCheck[]>('api/scraperhealth'),

    /**
     * Get health check for a specific site
     */
    getBySite: (siteName: string) =>
        apiRequestWithResult<ScraperHealthCheck>(`api/scraperhealth/${siteName}`),

    /**
     * Get all unhealthy sites
     */
    getUnhealthy: () =>
        apiRequestWithResult<ScraperHealthCheck[]>('api/scraperhealth/unhealthy'),

    /**
     * Reset circuit breaker for a site
     */
    resetCircuitBreaker: (siteName: string) =>
        apiRequestWithResult<boolean>(`api/scraperhealth/${siteName}/reset`, {
            method: 'POST'
        }),

    /**
     * Reset health metrics for a site
     */
    resetMetrics: (siteName: string) =>
        apiRequestWithResult<boolean>(`api/scraperhealth/${siteName}/reset-metrics`, {
            method: 'POST'
        })
}
