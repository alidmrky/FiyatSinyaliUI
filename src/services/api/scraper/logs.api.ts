import { apiRequestWithResult } from '../client'
import { ScraperLog, LogFilters, UnknownError } from '@/types/scraper.types'

export const logsApi = {
    /**
     * Get scraper logs with optional filters
     */
    getLogs: (filters: LogFilters = {}) => {
        const params = new URLSearchParams()

        if (filters.siteName) params.append('siteName', filters.siteName)
        if (filters.errorType) params.append('errorType', filters.errorType)
        if (filters.from) params.append('from', filters.from)
        if (filters.to) params.append('to', filters.to)

        const queryString = params.toString()
        const endpoint = queryString ? `api/scraperlogs?${queryString}` : 'api/scraperlogs'

        return apiRequestWithResult<ScraperLog[]>(endpoint)
    },

    /**
     * Get unknown errors for analysis
     */
    getUnknownErrors: (since?: string) => {
        const endpoint = since
            ? `api/scraperlogs/unknown-errors?since=${since}`
            : 'api/scraperlogs/unknown-errors'

        return apiRequestWithResult<UnknownError[]>(endpoint)
    },

    /**
     * Get error statistics for a site
     */
    getStatistics: (siteName: string, hours: number = 24) =>
        apiRequestWithResult<Record<string, number>>(
            `api/scraperlogs/statistics/${siteName}?hours=${hours}`
        )
}
