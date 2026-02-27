import { apiRequest } from '../client'
import { API_ENDPOINTS } from '@/constants/api.constants'
import type { ScrapTestRequest, ScrapTestResult } from '@/types/scraper.types'

export const scrapTestApi = {
    /**
     * Belirtilen site ve ürün URL'si için scraper test çalıştırır.
     * Veritabanına kayıt yapılmaz; sonuç anlık döner.
     */
    test: (request: ScrapTestRequest): Promise<ScrapTestResult> =>
        apiRequest<ScrapTestResult>(API_ENDPOINTS.SCRAP_TEST.TEST, {
            method: 'POST',
            body: JSON.stringify(request),
        }),
}
