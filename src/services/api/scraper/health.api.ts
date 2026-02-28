import { apiRequestWithResult } from '../client'
import { ScraperHealthCheck, HealthStatus } from '@/types/scraper.types'

// C# enum'lar varsayılan olarak integer serialize edilir (Healthy=0, Degraded=1, Unhealthy=2)
// Backend'e JsonStringEnumConverter eklenene kadar numeric→string map yapıyoruz
const HEALTH_STATUS_MAP: Record<number | string, HealthStatus> = {
    0: HealthStatus.Healthy,
    1: HealthStatus.Degraded,
    2: HealthStatus.Unhealthy,
    // String gelirse de doğru çalışsın
    Healthy: HealthStatus.Healthy,
    Degraded: HealthStatus.Degraded,
    Unhealthy: HealthStatus.Unhealthy,
}

function normalizeHealth(health: ScraperHealthCheck): ScraperHealthCheck {
    return {
        ...health,
        status: HEALTH_STATUS_MAP[health.status as unknown as number] ?? HealthStatus.Unhealthy,
    }
}

export const healthApi = {
    /**
     * Get all scraper health checks
     */
    getAll: async () => {
        const data = await apiRequestWithResult<ScraperHealthCheck[]>('api/scraperhealth')
        return data.map(normalizeHealth)
    },

    /**
     * Get health check for a specific site
     */
    getBySite: async (siteName: string) => {
        const data = await apiRequestWithResult<ScraperHealthCheck>(`api/scraperhealth/${siteName}`)
        return normalizeHealth(data)
    },

    /**
     * Get all unhealthy sites
     */
    getUnhealthy: async () => {
        const data = await apiRequestWithResult<ScraperHealthCheck[]>('api/scraperhealth/unhealthy')
        return data.map(normalizeHealth)
    },

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
